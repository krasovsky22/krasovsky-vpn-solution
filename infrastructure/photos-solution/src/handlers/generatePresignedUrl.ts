import { Handler, AppSyncResolverEvent } from 'aws-lambda';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const AWS_REGION = process.env.GRAPHQL_AWS_REGION;
const PHOTOS_S3_BUCKET = process.env.PHOTOS_S3_BUCKET;
const s3Client = new S3Client({ region: AWS_REGION });

export const handler: Handler = async (
  event: AppSyncResolverEvent<any, any>
) => {
  const s3Path = event?.prev?.result?.s3Path;

  if (!s3Path) {
    // earyly return
    return {
      statusCode: 400,
      body: 's3Path is required.',
    };
  }

  const getObjectParams = {
    Bucket: PHOTOS_S3_BUCKET,
    Key: `${s3Path}`,
  };
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return {
    statusCode: 200,
    body: url,
  };
};
