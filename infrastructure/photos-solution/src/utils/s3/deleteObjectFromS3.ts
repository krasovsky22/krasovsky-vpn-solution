import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

type InputType = {
  key: string;
  s3Client: S3Client;
  bucketName: string;
};

export const deleteObjectFromS3 = async ({
  key,
  s3Client,
  bucketName,
}: InputType) => {
  const command = new DeleteObjectCommand({
    Key: key,
    Bucket: bucketName,
  });

  return s3Client.send(command);
};
