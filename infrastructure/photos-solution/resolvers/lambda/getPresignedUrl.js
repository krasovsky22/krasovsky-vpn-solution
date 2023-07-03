export function request(ctx) {
  return {
    operation: 'Invoke',
    payload: ctx,
  };
}

export function response(ctx) {
  const presignedUrl = ctx.result.body ?? null;

  return {
    ...ctx.prev.result,
    s3PresignedUrl: presignedUrl,
  };
}
