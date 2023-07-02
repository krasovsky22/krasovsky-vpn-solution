import { util } from '@aws-appsync/utils';

export function request(ctx) {
  const values = ctx.arguments?.baseRecognitionDetails;
  const { rekognitionId, personId } = values;

  return {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues({
      PK: `PERSON#${personId}`,
      SK: `BASE_FACE_REKOGNITION#${rekognitionId}`,
    }),
    attributeValues: util.dynamodb.toMapValues({
      ...values,
      GSI1PK: `BASE_FACE_REKOGNITION#${rekognitionId}`,
      GSI1SK: `PERSON#${personId}`,
      _TYPE_: 'BASE_FACE_REKOGNITION',
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
