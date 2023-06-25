/* eslint-disable turbo/no-undeclared-env-vars */

import { Handler, S3CreateEvent } from 'aws-lambda';
import { S3Client } from '@aws-sdk/client-s3';
import { RekognitionClient } from '@aws-sdk/client-rekognition';

import { getImageBufferFromS3 } from '../utils/s3/getObjectBufferFromS3';
import { generateJpegFileName } from '../utils/images/generateJpegFileName';
import { convertHeicToJpeg } from '../utils/images/convertHeicToJpeg';
import { putImageBufferToS3 } from '../utils/s3/putObjectBufferToS3';
import { indexFaceInImage } from '../utils/rekognition/indexFaceInImage';
import { executeGraphqlFunction } from '../utils/graphql/executeGraphqlFunction';

const AWS_REGION = process.env.GRAPHQL_AWS_REGION;
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const BASE_PROCESSED_FOLDER = process.env.BASE_PROCESSED_FOLDER;
const REKOGNITION_COLLECTION_ID = process.env.REKOGNITION_COLLECTION_ID;

const s3Client = new S3Client({ region: AWS_REGION });
const rekognitionClient = new RekognitionClient({ region: AWS_REGION });

type SuccessResponseType = {
  success: true;
  data: any;
};

type FailedResponseType = {
  success: false;
  error: string;
};

type RecordProcessingResponse = SuccessResponseType | FailedResponseType;

export const handler: Handler = async (event: S3CreateEvent) => {
  let responses = [];
  try {
    responses = await Promise.all<RecordProcessingResponse>(
      (event?.Records ?? []).map(async (record) => {
        const { s3 } = record;

        const { bucket, object } = s3;
        const bucketName = bucket.name;
        const objectName = object.key;

        console.log(`processing ${objectName} in bucket ${bucketName}`);

        const {
          buffer: heicBuffer,
          metadata,
          error,
        } = await getImageBufferFromS3(s3Client, objectName, bucketName);

        if (error) {
          console.error('ERROR: ', error);
          return;
        }

        const personId = metadata?.person_id;
        if (!personId) {
          const error = `Incorrect metadata for uploaded file ${objectName} - ${bucketName}. person_id is required.`;
          console.error(error);
          return { success: false, error };
        }

        const jpegFileName = generateJpegFileName(objectName);
        const newKey = `${BASE_PROCESSED_FOLDER}/${jpegFileName}`;

        const jpegBuffer = await convertHeicToJpeg(heicBuffer);

        console.log(`saving ${newKey} into bucket ${bucketName}`);
        // move image to processed folder
        await putImageBufferToS3({
          key: newKey,
          buffer: jpegBuffer,
          bucket: bucketName,
          s3Client,
          metadata,
        });

        const faceIds = await indexFaceInImage({
          jpegBuffer,
          rekognitionClient,
          collectionId: REKOGNITION_COLLECTION_ID,
        });

        const data = await Promise.all(
          faceIds.map((rekognitionId) => {
            console.log(
              `creating dynamidb record for faceId ${rekognitionId} for user ${personId} and s3 path ${newKey}`
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
                s3Path: newKey,
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
