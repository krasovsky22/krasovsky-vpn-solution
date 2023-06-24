import { util } from '@aws-appsync/utils';

export function request(ctx) {
  const { source, args } = ctx;

  const action = ctx.info.fieldName === 'startVpnInstance' ? 'start' : 'stop';

  return {
    operation: 'Invoke',
    payload: { ...args, action },
  };
}

export function response(ctx) {
  return true;
}
