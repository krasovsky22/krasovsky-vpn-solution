import consumers from 'node:stream/consumers';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

//docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_GetObject_section.html
export const getImageBufferFromS3 = async (
  s3Client: S3Client,
  key: string,
  bucket: string
): Promise<{
  buffer: Buffer;
  metadata: Record<string, string>;
  error?: string;
}> => {
  try {
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucket,
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
