import { util } from '@aws-appsync/utils';

export function request(ctx) {
  const values = ctx.arguments?.vpnStateDetails;
  const { instanceId } = values;
  const createdAt = util.time.nowISO8601();
  
  return {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues({
      PK: `VPNINSTANCE#${instanceId}`,
      SK: `VPNINSTANCE#${instanceId}`,
    }),
    attributeValues: util.dynamodb.toMapValues({
      ...values,
      _TYPE_: 'VPNINSTANCE',
      ...values,
      createdAt,
    }),
    condition: {
      expression: 'attribute_not_exists(PK)',
    },
  };
}

export function response(ctx) {
  return ctx.result;
}
