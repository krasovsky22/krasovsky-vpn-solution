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
const PHOTO_PROCESSED_FOLDER = process.env.PHOTO_PROCESSED_FOLDER;
const REKOGNITION_COLLECTION_ID = process.env.REKOGNITION_COLLECTION_ID;

const s3Client = new S3Client({ region: AWS_REGION });
const rekognitionClient = new RekognitionClient({ region: AWS_REGION });

export const handler: Handler = async (event: S3CreateEvent) => {
  return {
    statusCode: 200,
    body: {},
  };
};
