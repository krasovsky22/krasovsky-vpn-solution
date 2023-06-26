import { util } from '@aws-appsync/utils';

export function request(ctx) {
  const { dimensions, ...values } = ctx.arguments?.input;
  const { photoId, personId } = values;

  return {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues({
      PK: `PHOTO#${photoId}`,
      SK: `PERSON#${personId}`,
    }),
    attributeValues: util.dynamodb.toMapValues({
      GSI1PK: `PERSON#${personId}`,
      GSI1SK: `PHOTO#${photoId}`,
      _TYPE_: 'PHOTO_PERSON_CONNECTOR',
      ...values,
      dimensions,
      createdAt: util.time.nowISO8601(),
    }),
    condition: {
      expression: 'attribute_not_exists(PK)',
    },
  };
}

export function response(ctx) {
  return ctx.result;
}
