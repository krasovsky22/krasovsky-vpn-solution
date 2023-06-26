import { util } from '@aws-appsync/utils';

export function request(ctx) {
  const { personId } = ctx.args;
  return {
    operation: 'Query',
    index: 'GSI1',
    query: {
      expression: 'GSI1PK = :pk',
      expressionValues: util.dynamodb.toMapValues({
        ':pk': `PERSON#${personId}`,
      }),
    },
  };
}

export function response(ctx) {
  const results = ctx.result.items;

  let person = {};
  let photosWithPerson = [];

  for (const item of results) {
    if (item._TYPE_ === 'PERSON') {
      person = item;
    } else if (item._TYPE_ === 'PHOTO_PERSON_CONNECTOR') {
      photosWithPerson.push(item);
    }
  }

  person.photosWithPerson = photosWithPerson;

  return person;
}
