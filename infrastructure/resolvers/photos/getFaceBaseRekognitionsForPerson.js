import { util } from '@aws-appsync/utils';

/**
 * Performs a scan on the dynamodb data source
 */
export function request(ctx) {
  const { personId } = ctx.args;
  return {
    operation: 'Query',
    query: {
      expression: 'PK = :pk',
      expressionValues: util.dynamodb.toMapValues({
        ':pk': `PERSON#${personId}`,
      }),
    },
  };
}

/**
 * return a list of scanned todo items
 */
export function response(ctx) {
  const results = ctx.result.items;

  let person = {};
  let baseFaceRekognitions = [];

  for (const item of results) {
    if (item._TYPE_ === 'PERSON') {
      person = item;
    } else if (item._TYPE_ === 'BASE_FACE_REKOGNITION') {
      baseFaceRekognitions.push(item);
    }
  }

  person.baseFaceRekognitions = baseFaceRekognitions;

  return person;
}
