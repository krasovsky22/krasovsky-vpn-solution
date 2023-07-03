import { Handler, AppSyncResolverEvent } from 'aws-lambda';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const AWS_REGION = process.env.GRAPHQL_AWS_REGION;
const PHOTOS_S3_BUCKET = process.env.PHOTOS_S3_BUCKET;
const s3Client = new S3Client({ region: AWS_REGION });

export const handler: Handler = async (
  event: AppSyncResolverEvent<any, any>
) => {
  console.log('json stringify', JSON.stringify(event, null, 2));
  const { s3Path } = event.prev.result;

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
