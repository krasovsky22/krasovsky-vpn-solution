/* eslint-disable turbo/no-undeclared-env-vars */
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require('@aws-sdk/client-s3');
const {
  RekognitionClient,
  SearchFacesByImageCommand,
  DetectFacesCommand,
} = require('@aws-sdk/client-rekognition');
const convert = require('heic-convert');
const sharp = require('sharp');

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
const processedFolderDestination = process.env.PROCESSED_FOLDER;
const rekognitionCollectionId = process.env.REKOGNITION_COLLECTION_ID;

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

const executeGraphqlFunction = async (personName, s3Path, rekognitionId) => {
  const query = /* GraphQL */ `
    mutation createFaceBaseRecognition(
      $baseRecognitionDetails: BaseFaceRekognitionInput!
    ) {
      createFaceBaseRecognition(
        baseRecognitionDetails: $baseRecognitionDetails
      ) {
        name
        s3Path
        createdAt
        rekognitionId
      }
    }
  `;

  const variables = {
    baseRecognitionDetails: {
      s3Path,
      rekognitionId,
      name: personName,
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

const handler = async (event) => {
  await Promise.all(
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

      const pathArr = objectName.split('/');
      const fileName = pathArr[pathArr.length - 1];
      const extentionSplit = fileName.split('.');
      const fileNameWithoutExtention = extentionSplit[0];

      try {
        const jpegBuffer = await convert({
          buffer: heicBuffer,
          format: 'JPEG',
          quality: 0.8, // Adjust the quality value as needed
        });

        const newKey = `${processedFolderDestination}/${fileNameWithoutExtention}.JPEG`;
        console.log(`saving ${newKey} into bucket ${bucketName}`);
        // move image to processed folder
        await putImageBufferToS3(jpegBuffer, newKey, bucketName, metadata);

        const command = new DetectFacesCommand({
          //   CollectionId: rekognitionCollectionId,
          Image: {
            Bytes: jpegBuffer,
          },
        });

        console.log(
          `executing face indexing command for ${newKey} in collection_id ${rekognitionCollectionId}`
        );
        const rekognitionResponse = await rekognitionClient.send(command);

        console.log('response', rekognitionResponse);

        const { width: imageWidth, height: imageHeight } = await sharp(
          jpegBuffer
        ).metadata();

        return await Promise.all(
          rekognitionResponse?.FaceDetails?.map(async (faceRecord, index) => {
            const { Face, Similarity, BoundingBox } = faceRecord;

            const cropLeft = Math.round(BoundingBox.Left * imageWidth);
            const cropTop = Math.round(BoundingBox.Top * imageHeight);
            const cropWidth = Math.round(BoundingBox.Width * imageWidth);
            const cropHeight = Math.round(BoundingBox.Height * imageHeight);

            const croppedImageBuffer = await sharp(jpegBuffer)
              .extract({
                left: cropLeft,
                top: cropTop,
                width: cropWidth,
                height: cropHeight,
              })
              .toBuffer();

            console.log(`storing copped image ${index}`);
            const newTempKey = newKey.replace('.', `_${index}.`);
            await putImageBufferToS3(
              croppedImageBuffer,
              newTempKey,
              bucketName,
              metadata
            );

            return { buffer: croppedImageBuffer, key: newTempKey };

            // const { FaceId } = Face;

            // console.log(
            //   `creating dynamidb record for faceId ${FaceId} for user ${metadata.name} and s3 path ${newKey}`
            // );
            // return executeGraphqlFunction(metadata.name, newKey, FaceId);
          }) ?? []
        ).then((croppedImageBuffers) => {
          return Promise.all(
            croppedImageBuffers.map(async ({ buffer, key }) => {
              const command = new SearchFacesByImageCommand({
                CollectionId: rekognitionCollectionId,
                Image: {
                  Bytes: buffer,
                },
                MaxFaces: 1,
              });

              const rekognitionResponse = await rekognitionClient.send(command);

              rekognitionResponse?.FaceMatches?.map((face) => {
                console.log(
                  `detected in cropped ${key} image ${JSON.stringify(face)}`
                );
              });
            })
          );
        });
      } catch (e) {
        console.log('ERROR', e);
      }
    })
  );

  const statusCode = 200;
  return {
    statusCode,
    body: JSON.stringify(event),
  };
};

module.exports = {
  handler,
};
