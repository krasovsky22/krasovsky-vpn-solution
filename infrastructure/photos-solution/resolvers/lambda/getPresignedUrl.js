export function request(ctx) {
  const executeLambda = ctx.info.selectionSetList.includes('s3PresignedUrl');
  if (!executeLambda) {
    return {
      operation: 'Invoke',
      payload: null,
    };
  }
  return {
    operation: 'Invoke',
    payload: ctx,
  };
}

export function response(ctx) {
  const presignedUrl = ctx.result?.body ?? null;

  return {
    ...ctx.prev.result,
    s3PresignedUrl: presignedUrl,
  };
}
