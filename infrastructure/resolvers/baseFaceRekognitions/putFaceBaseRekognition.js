import { util } from '@aws-appsync/utils';

export function request(ctx) {
  const { rekognitionId, ...values } = ctx.arguments?.baseRecognitionDetails;
  const createdAt = util.time.nowISO8601();
  return dynamodbPutRequest({
    key: { rekognitionId },
    values: { ...values, createdAt },
  });
}

export function response(ctx) {
  return ctx.result;
}

function dynamodbPutRequest({ key, values }) {
  return {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues(key),
    attributeValues: util.dynamodb.toMapValues(values),
  };
}
