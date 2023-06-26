/* eslint-disable turbo/no-undeclared-env-vars */

import { S3Client } from '@aws-sdk/client-s3';
import { Handler, S3CreateEvent } from 'aws-lambda';

import { RecordProcessingResponse } from '../types';
import { deleteObjectFromS3 } from '../utils/s3/deleteObjectFromS3';
import { putObjectBufferToS3 } from '../utils/s3/putObjectBufferToS3';
import { getFileNameFromPath } from '../utils/files/getFileNameFromPath';
import { getObjectBufferFromS3 } from '../utils/s3/getObjectBufferFromS3';

const AWS_REGION = process.env.GRAPHQL_AWS_REGION;
const UNSUPPPORTED_FOLDER = process.env.UNSUPPPORTED_FOLDER;
const HEIC_CONVERTER_FOLDER = process.env.HEIC_CONVERTER_FOLDER;
const IMAGE_SORTING_FOLDER = process.env.IMAGE_SORTING_FOLDER;

const s3Client = new S3Client({ region: AWS_REGION });

/**
 * Entry points on file upload
 * will move it based on extention for future processing
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
          return {
            success: false,
            error,
          };
        }

        const fileExtention = uploadedObjectFullPath.split('.').pop();
        const fileNameWithoutPath = getFileNameFromPath(uploadedObjectFullPath);

        switch (fileExtention.toLocaleLowerCase()) {
          case 'heic':
            // move to heic processing folder
            await putObjectBufferToS3({
              buffer,
              bucketName,
              s3Client,
              metadata,
              newKey: `${HEIC_CONVERTER_FOLDER}/${fileNameWithoutPath}`,
            });
            break;
          case 'jpeg':
          case 'jpg':
          case 'png':
            // already image, move to sorting
            await putObjectBufferToS3({
              buffer,
              bucketName,
              s3Client,
              metadata,
              newKey: `${IMAGE_SORTING_FOLDER}/${fileNameWithoutPath}`,
            });
            break;

          default:
            // unsupported
            await putObjectBufferToS3({
              buffer,
              bucketName,
              s3Client,
              metadata,
              newKey: `${UNSUPPPORTED_FOLDER}/${fileNameWithoutPath}`,
            });
            break;
        }

        // remove initial file
        await deleteObjectFromS3({
          s3Client,
          bucketName,
          key: uploadedObjectFullPath,
        });

        return {
          success: true,
          data: [],
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
