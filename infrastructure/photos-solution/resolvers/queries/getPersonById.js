import { util } from '@aws-appsync/utils';

export function request(ctx) {
  const { personId } = ctx.args;
  return {
    operation: 'Query',
    query: {
      expression: 'PK = :pk and SK = :sk',
      expressionValues: util.dynamodb.toMapValues({
        ':pk': `PERSON#${personId}`,
        ':sk': `PERSON#${personId}`,
      }),
    },
  };
}

export function response(ctx) {
  return ctx.result.items;
}
