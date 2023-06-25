import consumers from 'node:stream/consumers';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

type InputType = {
  key: string;
  s3Client: S3Client;
  bucketName: string;
};

type ReturnType = Promise<{
  buffer: Buffer;
  metadata: Record<string, string>;
  error?: string;
}>;
//docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_GetObject_section.html
export const getObjectBufferFromS3 = async ({
  key,
  s3Client,
  bucketName,
}: InputType): ReturnType => {
  try {
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await s3Client.send(getObjectCommand);
    const { Metadata, Body } = response;

    if (!Body) {
      throw 'Unable to fetch file.';
    }

    const buffer = await consumers.buffer(Body as NodeJS.ReadableStream);

    return {
      buffer,
      metadata: Metadata,
    };
  } catch (err) {
    // Handle the error or throw
    return {
      buffer: null,
      metadata: null,
      error: err,
    };
  }
};
