/* eslint-disable turbo/no-undeclared-env-vars */

import { S3Client } from '@aws-sdk/client-s3';
import { Handler, S3CreateEvent } from 'aws-lambda';
import { RekognitionClient } from '@aws-sdk/client-rekognition';

import { RecordProcessingResponse } from '../types';
import { deleteObjectFromS3 } from '../utils/s3/deleteObjectFromS3';
import { putObjectBufferToS3 } from '../utils/s3/putObjectBufferToS3';
import { indexFaceInImage } from '../utils/rekognition/indexFaceInImage';
import { getFileNameFromPath } from '../utils/files/getFileNameFromPath';
import { getObjectBufferFromS3 } from '../utils/s3/getObjectBufferFromS3';
import { executeGraphqlFunction } from '../utils/graphql/executeGraphqlFunction';

const AWS_REGION = process.env.GRAPHQL_AWS_REGION;
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const BASE_PROCESSED_FOLDER = process.env.BASE_PROCESSED_FOLDER;
const REKOGNITION_COLLECTION_ID = process.env.REKOGNITION_COLLECTION_ID;

const s3Client = new S3Client({ region: AWS_REGION });
const rekognitionClient = new RekognitionClient({ region: AWS_REGION });

/**
 * will index faces on a photo
 * will add face to rekognition collection id
 * will add face_id into dynamo db base images
 */
export const handler: Handler = async (event: S3CreateEvent) => {
  let responses = [];
  try {
    responses = await Promise.all<RecordProcessingResponse>(
      (event?.Records ?? []).map(async (record) => {
        const { s3 } = record;

        const { bucket, object } = s3;
        const bucketName = bucket.name;
        const uploadedObjectFullPath = object.key;

        const { buffer, metadata, error } = await getObjectBufferFromS3({
          s3Client,
          bucketName,
          key: uploadedObjectFullPath,
        });

        if (error) {
          console.error('ERROR: ', error);
          return { success: false, error };
        }

        const personId = metadata['person-id'];
        if (!personId) {
          const error = `Incorrect metadata for uploaded file ${uploadedObjectFullPath} - ${bucketName}. person-id tag is required.`;
          console.error(error);
          return { success: false, error };
        }

        const faceIds = await indexFaceInImage({
          rekognitionClient,
          jpegBuffer: buffer,
          collectionId: REKOGNITION_COLLECTION_ID,
        });

        const fileNameWithoutPath = getFileNameFromPath(uploadedObjectFullPath);
        const newPath = `${BASE_PROCESSED_FOLDER}/${fileNameWithoutPath}`;

        await putObjectBufferToS3({
          buffer,
          bucketName,
          s3Client,
          metadata,
          newKey: newPath,
        });

        const data = await Promise.all(
          faceIds.map((rekognitionId) => {
            console.log(
              `creating dynamidb record for faceId ${rekognitionId} for user ${personId} and s3 path ${newPath}`
            );

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
                s3Path: newPath,
                personId,
                rekognitionId,
              },
            };

            return executeGraphqlFunction({
              query,
              variables,
              region: AWS_REGION,
              graphqlEndpoint: GRAPHQL_ENDPOINT,
            });
          })
        );

        console.log('deleting file ' + uploadedObjectFullPath);
        // remove original file
        await deleteObjectFromS3({
          s3Client,
          bucketName,
          key: uploadedObjectFullPath,
        });

        return {
          success: true,
          data,
        };
      })
    );
  } catch (error) {
    console.error('ERROR', error);
    return {
      statusCode: 500,
      body: JSON.stringify(error, null, 2),
    };
  }

  return {
    statusCode: 200,
    body: responses.flat(),
  };
};
