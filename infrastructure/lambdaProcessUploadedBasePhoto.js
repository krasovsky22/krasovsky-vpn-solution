/* eslint-disable turbo/no-undeclared-env-vars */
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require('@aws-sdk/client-s3');
const {
  RekognitionClient,
  IndexFacesCommand,
} = require('@aws-sdk/client-rekognition');
const convert = require('heic-convert');

const fetch = require('node-fetch');
const crypto = require('@aws-crypto/sha256-js');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');
const { SignatureV4 } = require('@aws-sdk/signature-v4');
const { HttpRequest } = require('@aws-sdk/protocol-http');

const s3Client = new S3Client();
const rekognitionClient = new RekognitionClient();

const { Sha256 } = crypto;
const AWS_REGION = process.env.GRAPHQL_AWS_REGION;
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const BASE_PROCESSED_FOLDER = process.env.BASE_PROCESSED_FOLDER;
const REKOGNITION_COLLECTION_ID = process.env.REKOGNITION_COLLECTION_ID;

// https://stackoverflow.com/questions/36942442/how-to-get-response-from-s3-getobject-in-node-js
const getImageBufferFromS3 = async (key, bucket) => {
  return new Promise(async (resolve, reject) => {
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    try {
      const response = await s3Client.send(getObjectCommand);
      const { Metadata } = response;

      // Store all of data chunks returned from the response data stream
      // into an array then use Array#join() to use the returned contents as a String
      let responseDataChunks = [];

      // Handle an error while streaming the response body
      response.Body.once('error', (err) => reject(err));

      // Attach a 'data' listener to add the chunks of data to our array
      // Each chunk is a Buffer instance
      response.Body.on('data', (chunk) => responseDataChunks.push(chunk));

      // Once the stream has no more data, join the chunks into a string and return the string
      response.Body.once('end', () =>
        resolve({
          buffer: Buffer.concat(responseDataChunks),
          metadata: Metadata,
        })
      );
    } catch (err) {
      // Handle the error or throw
      return reject(err);
    }
  });
};

const putImageBufferToS3 = async (buffer, key, bucket, metadata) => {
  const command = new PutObjectCommand({
    Key: key,
    Body: buffer,
    Bucket: bucket,
    Metadata: metadata,
  });

  return s3Client.send(command);
};

const executeGraphqlFunction = async (personId, s3Path, rekognitionId) => {
  const query = /* GraphQL */ `
    mutation createFaceBaseRecognition(
      $baseRecognitionDetails: BaseFaceRekognitionInput!
    ) {
      createFaceBaseRecognition(
        baseRecognitionDetails: $baseRecognitionDetails
      ) {
        s3Path
        personId
        rekognitionId
      }
    }
  `;

  const variables = {
    baseRecognitionDetails: {
      s3Path,
      personId,
      rekognitionId,
    },
  };

  const endpoint = new URL(GRAPHQL_ENDPOINT);

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region: AWS_REGION,
    service: 'appsync',
    sha256: Sha256,
  });

  const requestToBeSigned = new HttpRequest({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      host: endpoint.host,
    },
    hostname: endpoint.host,
    body: JSON.stringify({ query, variables }),
    path: endpoint.pathname,
  });

  const signed = await signer.sign(requestToBeSigned);
  const request = new fetch.Request(GRAPHQL_ENDPOINT, signed);

  let statusCode = 200;
  let body;
  let response;

  try {
    response = await fetch(request);
    body = await response.json();
    if (body.errors) statusCode = 400;
  } catch (error) {
    statusCode = 500;
    body = {
      errors: [
        {
          message: error.message,
        },
      ],
    };
  }

  console.log({
    statusCode,
    body: JSON.stringify(body),
  });

  return {
    statusCode,
    body: JSON.stringify(body),
  };
};

const convertHeicToJpeg = async (heicBuffer) => {
  return convert({
    buffer: heicBuffer,
    format: 'JPEG',
    quality: 0.8, // Adjust the quality value as needed
  });
};

/** will convert uploads/test.HEIC into test */
const generateJpegFileName = (originalFilePath) => {
  // remove all subpathes
  const pathArr = originalFilePath.split('/');
  const fileName = pathArr[pathArr.length - 1];
  // remove extention
  const extentionSplit = fileName.split('.');
  return extentionSplit[0] + '.JPEG';
};

const findFaceInImage = async (jpegBuffer) => {
  const indexFacesCommand = new IndexFacesCommand({
    CollectionId: REKOGNITION_COLLECTION_ID,
    Image: {
      Bytes: jpegBuffer,
    },
    MaxFaces: 1,
  });

  console.log(
    `executing face indexing command for ${newKey} in collection_id ${REKOGNITION_COLLECTION_ID}`
  );
  const rekognitionResponse = await rekognitionClient.send(indexFacesCommand);

  return rekognitionResponse?.FaceRecords.map(
    (faceRecord) => faceRecord.Face.FaceId
  );
};

const handler = async (event) => {
  try {
    const responses = await Promise.all(
      (event?.Records ?? []).map(async (record) => {
        const { s3 } = record;

        const { bucket, object } = s3;
        const bucketName = bucket.name;
        const objectName = object.key;

        console.log(`processing ${objectName} in bucket ${bucketName}`);

        const { buffer: heicBuffer, metadata } = await getImageBufferFromS3(
          objectName,
          bucketName
        );

        if (!metadata?.personId) {
          const error = `Incorrect metadata for uploaded file ${objectName} - ${bucketName}. personId is required.`;
          console.error(error);
          return Promise.rejeect(errors);
        }

        const { person_id: personId } = metadata;
        const jpegFileName = generateJpegFileName(objectName);
        const newKey = `${BASE_PROCESSED_FOLDER}/${jpegFileName}`;

        const jpegBuffer = await convertHeicToJpeg(heicBuffer);

        console.log(`saving ${newKey} into bucket ${bucketName}`);
        // move image to processed folder
        await putImageBufferToS3(jpegBuffer, newKey, bucketName, metadata);

        const faceIds = await findFaceInImage(jpegBuffer);

        await Promise.all(
          faceIds.map((rekognitionId) => {
            console.log(
              `creating dynamidb record for faceId ${rekognitionId} for user ${personId} and s3 path ${newKey}`
            );
            return executeGraphqlFunction(personId, newKey, rekognitionId);
          })
        );

        return Promise.resolve({ s3path: newKey, rekognitionId, personId });
      })
    );
  } catch (error) {
    return {
      statusCode: 500,
      body: error,
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(responses),
  };
};

module.exports = {
  handler,
};
