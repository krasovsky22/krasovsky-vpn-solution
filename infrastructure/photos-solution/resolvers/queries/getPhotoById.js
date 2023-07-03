import { util } from '@aws-appsync/utils';

export function request(ctx) {
  const { id } = ctx.args;
  return {
    operation: 'Query',
    query: {
      expression: 'PK = :pk and SK = :sk',
      expressionValues: util.dynamodb.toMapValues({
        ':pk': `PHOTO#${id}`,
        ':sk': `PHOTO#${id}`,
      }),
    },
  };
}

export function response(ctx) {
  return ctx.result.items[0];
}
