import { util } from '@aws-appsync/utils';

export function request(ctx) {
  const { id } = ctx.args;
  return {
    operation: 'Query',
    index: 'GSI1',
    query: {
      expression: 'GSI1PK = :pk',
      expressionValues: util.dynamodb.toMapValues({
        ':pk': `BASE_FACE_REKOGNITION#${id}`,
      }),
    },
  };
}

export function response(ctx) {
  return ctx.result.items;
}
