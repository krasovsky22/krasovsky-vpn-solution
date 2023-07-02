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

/**
 * will load image from s3
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

        const faceIds = await Promise.all(
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

            // await putObjectBufferToS3({
            //   newKey: `test/${index}.JPEG`,
            //   buffer: croppedImageBuffer,
            //   s3Client,
            //   bucketName,
            // });

            const faces = await searchFacesInImage({
              rekognitionClient,
              jpegBuffer: croppedImageBuffer,
              collectionId: REKOGNITION_COLLECTION_ID,
            });

            return faces[0]?.Face?.FaceId;
          })
        );

        // make sure no nulls
        const filteredFaceIds = faceIds.filter((faceId) => faceId);
        console.log('Detected faces', filteredFaceIds);

        return {
          success: true,
          data: {
            detectedFaceIds: filteredFaceIds,
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
