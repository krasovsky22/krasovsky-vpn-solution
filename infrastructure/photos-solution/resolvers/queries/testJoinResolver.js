/**
 * These are available AWS AppSync utilities that you can use in your request and response handler.
 * For more information about the utilities that are currently implemented, see
 * https://docs.aws.amazon.com/en_us/appsync/latest/devguide/resolver-reference-overview-js.html#utility-resolvers.
 */
import { util } from '@aws-appsync/utils';

/**
 * This function handles an incoming request, then converts it into a request
 * object for the selected data source operation.
 * You can find more code samples here: https://github.com/aws-samples/aws-appsync-resolver-samples.
 * @param ctx - Contextual information for your resolver invocation.
 * @returns - A data source request object.
 */
const TABLE_NAME = 'serverless-familyPhotos-dev';
export function request(ctx) {
  const photosWithPerson = ctx.prev?.result?.photosWithPerson ?? [];
  if (photosWithPerson.length === 0) {
    return {};
  }

  const photoIds = photosWithPerson.map(({ photoId }) => photoId);

  return {
    operation: 'BatchGetItem',
    tables: {
      [TABLE_NAME]: {
        keys: photoIds.map((photoId) =>
          util.dynamodb.toMapValues({
            PK: `PHOTO#${photoId}`,
            SK: `PHOTO#${photoId}`,
          })
        ),
      },
    },
  };
}

/**
 * This function handles the response from the data source.
 * You can find more code samples here: https://github.com/aws-samples/aws-appsync-resolver-samples.
 * @param ctx - Contextual information for your resolver invocation.
 * @returns - A result that is passed to the next function, or the response handler of the pipeline resolver.
 */
export function response(ctx) {
  const photos = ctx.result.data[TABLE_NAME];
  const prevResult = ctx.prev.result;
  prevResult.photosWithPerson = prevResult.photosWithPerson.map(
    (connectorResult) => {
      const { photoId } = connectorResult;

      const photo = photos.find((tPhoto) => tPhoto.id === photoId);
      return { ...connectorResult, photo };
    }
  );

  return prevResult;
}
