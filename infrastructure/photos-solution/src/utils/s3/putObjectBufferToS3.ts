import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

type InputType = {
  newKey: string;
  buffer: Buffer;
  s3Client: S3Client;
  bucketName: string;
  metadata?: Record<string, string>;
};

export const putObjectBufferToS3 = async ({
  newKey,
  buffer,
  s3Client,
  metadata,
  bucketName,
}: InputType) => {
  const command = new PutObjectCommand({
    Key: newKey,
    Body: buffer,
    Bucket: bucketName,
    Metadata: metadata,
  });

  return s3Client.send(command);
};
