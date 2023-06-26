import { util } from '@aws-appsync/utils';

export function request(ctx) {
  const values = ctx.arguments?.input;
  const id = util.autoId();
  const createdAt = util.time.nowISO8601();
  return {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues({
      PK: `PHOTO#${id}`,
      SK: `PHOTO#${id}`,
    }),
    attributeValues: util.dynamodb.toMapValues({
      GSI1PK: `PHOTO#${id}`,
      GSI1SK: `PHOTO#${id}`,
      _TYPE_: 'PHOTO',
      ...values,
      id,
      createdAt,
    }),
  };
}

export function response(ctx) {
  return ctx.result;
}
