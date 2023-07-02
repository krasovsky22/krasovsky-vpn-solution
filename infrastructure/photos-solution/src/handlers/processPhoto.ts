/* eslint-disable turbo/no-undeclared-env-vars */

import sharp from 'sharp';
import { S3Client } from '@aws-sdk/client-s3';
import { Handler, S3CreateEvent } from 'aws-lambda';
import { RekognitionClient } from '@aws-sdk/client-rekognition';

import { RecordProcessingResponse } from '../types';
import { deleteObjectFromS3 } from '../utils/s3/deleteObjectFromS3';
import { putObjectBufferToS3 } from '../utils/s3/putObjectBufferToS3';
import { detectFacesInImage } from '../utils/rekognition/detectFacesInImage';
import { getFileNameFromPath } from '../utils/files/getFileNameFromPath';
import { getObjectBufferFromS3 } from '../utils/s3/getObjectBufferFromS3';
import { executeGraphqlFunction } from '../utils/graphql/executeGraphqlFunction';
import { searchFacesInImage } from '../utils/rekognition/searchFacesInImage';

const AWS_REGION = process.env.GRAPHQL_AWS_REGION;
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const PHOTO_PROCESSED_FOLDER = process.env.PHOTO_PROCESSED_FOLDER;
const REKOGNITION_COLLECTION_ID = process.env.REKOGNITION_COLLECTION_ID;

const s3Client = new S3Client({ region: AWS_REGION });
const rekognitionClient = new RekognitionClient({ region: AWS_REGION });

const fetchPersonIdByBaseRecognitionId = async (
  baseRecognitionId: string
): Promise<string | null> => {
  const query = `
    query getFaceBaseRekognition($id: ID!) {
        getFaceBaseRekognitionById(id: $id) {
            personId
    }
}
`;
  const faceRecognition = await executeGraphqlFunction({
    query,
    region: AWS_REGION,
    graphqlEndpoint: GRAPHQL_ENDPOINT,
    variables: { id: baseRecognitionId },
  });

  return faceRecognition?.getFaceBaseRekognitionById?.personId;
};

const createPhoto = async (s3Path: string) => {
  const mutation = `
    mutation addPhotoMutation($input: PhotoInput!) {
        addPhoto(input: $input) {
            id
        }
    }
`;

  const photo = await executeGraphqlFunction({
    query: mutation,
    region: AWS_REGION,
    graphqlEndpoint: GRAPHQL_ENDPOINT,
    variables: { input: { s3Path } },
  });

  return photo?.addPhoto;
};

type PhotoPersonConnectorInputType = {
  personId: string;
  photoId: string;
  dimensions: object;
};

const addPhotoPersonConnector = async ({
  personId,
  photoId,
  dimensions,
}: PhotoPersonConnectorInputType) => {
  const mutation = `
    mutation addPhotoPersonConnectorMutation($input: PhotoPersonConnectorInput!) {
        addPhotoPersonConnector(input: $input) {
            photoId
            personId
        }
    }
`;

  const photo = await executeGraphqlFunction({
    query: mutation,
    region: AWS_REGION,
    graphqlEndpoint: GRAPHQL_ENDPOINT,
    variables: {
      input: { personId, photoId, dimensions: JSON.stringify(dimensions) },
    },
  });

  return photo?.addPhotoPersonConnector;
};

/**
 * will load image from s3
 * will move photo to archive directory
 * will detect faces from image
 * will crop image to get only face
 * will compare face to existing recognized faces collection
 * will store photo and photo_person_connector in dynamodb
 * will move file to processed/archived folder
 */
export const handler: Handler = async (event: S3CreateEvent) => {
  let responses;
  try {
    responses = await Promise.all<RecordProcessingResponse>(
      (event?.Records ?? []).map(async (record) => {
        const { s3 } = record;

        const { bucket, object } = s3;
        const bucketName = bucket.name;
        const uploadedObjectFullPath = object.key;

        // load object from s3
        const { buffer, metadata, error } = await getObjectBufferFromS3({
          s3Client,
          bucketName,
          key: uploadedObjectFullPath,
        });

        if (error) {
          console.error('ERROR: ', error);
          return { success: false, error };
        }

        // move photo
        const fileNameWithoutPath = getFileNameFromPath(uploadedObjectFullPath);
        const newKey = `${PHOTO_PROCESSED_FOLDER}/${fileNameWithoutPath}`;
        await putObjectBufferToS3({
          buffer,
          bucketName,
          s3Client,
          metadata,
          newKey,
        });

        //delete original photo
        await deleteObjectFromS3({
          s3Client,
          bucketName,
          key: uploadedObjectFullPath,
        });

        // create photo record
        const { id: photoId } = await createPhoto(newKey);

        // detect faces
        const faceDetails = await detectFacesInImage({
          rekognitionClient,
          jpegBuffer: buffer,
        });

        if (faceDetails === null) {
          return { success: false, error: 'Unabled to detect faces in image.' };
        }

        // get image stats
        const { width: imageWidth, height: imageHeight } = await sharp(
          buffer
        ).metadata();

        const photoPersonConnectors = await Promise.all(
          faceDetails?.map(async (faceRecord, index) => {
            const { BoundingBox } = faceRecord;

            const cropLeft = Math.round(BoundingBox.Left * imageWidth);
            const cropTop = Math.round(BoundingBox.Top * imageHeight);
            const cropWidth = Math.round(BoundingBox.Width * imageWidth);
            const cropHeight = Math.round(BoundingBox.Height * imageHeight);

            // crop image to have only face
            const croppedImageBuffer = await sharp(buffer)
              .extract({
                left: cropLeft,
                top: cropTop,
                width: cropWidth,
                height: cropHeight,
              })
              .toBuffer();

            const faces = await searchFacesInImage({
              rekognitionClient,
              jpegBuffer: croppedImageBuffer,
              collectionId: REKOGNITION_COLLECTION_ID,
            });

            const { FaceId: baseFaceRekognitionId, BoundingBox: dimensions } =
              faces[0]?.Face;
            if (!baseFaceRekognitionId) {
              console.warn('Unable to locate person');
              return null;
            }

            const personId = await fetchPersonIdByBaseRecognitionId(
              baseFaceRekognitionId
            );

            if (!personId) {
              console.warn(
                `Unable to locate person with base face rekognition ${baseFaceRekognitionId}`
              );
              return null;
            }

            const response = await addPhotoPersonConnector({
              personId,
              photoId,
              dimensions,
            });
            console.log('created ', response);

            // create
            return response;
          })
        );

        return {
          success: true,
          data: {
            photoPersonConnectors,
          },
        };
      })
    );
  } catch (error) {
    return {
      statusCode: 500,
      body: {},
      error,
    };
  }

  return {
    statusCode: 200,
    body: responses,
  };
};
