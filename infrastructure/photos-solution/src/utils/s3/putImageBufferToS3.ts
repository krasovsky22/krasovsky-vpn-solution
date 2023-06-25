import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

type InputType = {
  s3Client: S3Client;
  buffer: Buffer;
  key: string;
  bucket: string;
  metadata: Record<string, string>;
};

export const putImageBufferToS3 = async ({
  key,
  buffer,
  bucket,
  s3Client,
  metadata,
}: InputType) => {
  const command = new PutObjectCommand({
    Key: key,
    Body: buffer,
    Bucket: bucket,
    Metadata: metadata,
  });

  return s3Client.send(command);
};
