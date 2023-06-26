import { util } from '@aws-appsync/utils';

export function request(ctx) {
  const values = ctx.arguments?.personDetails;
  const id = util.autoId();
  const createdAt = util.time.nowISO8601();
  return {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues({
      PK: `PERSON#${id}`,
      SK: `PERSON#${id}`,
    }),
    attributeValues: util.dynamodb.toMapValues({
      GSI1PK: `PERSON#${id}`,
      GSI1SK: `PERSON#${id}`,
      _TYPE_: 'PERSON',
      ...values,
      id,
      createdAt,
    }),
  };
}

export function response(ctx) {
  return ctx.result;
}
