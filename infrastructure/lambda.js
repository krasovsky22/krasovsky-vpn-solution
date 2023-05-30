/* eslint-disable turbo/no-undeclared-env-vars */
const { marshall } = require('@aws-sdk/util-dynamodb');
const {
  PutItemCommand,
  UpdateItemCommand,
} = require('@aws-sdk/client-dynamodb');

const db = require('./db');

const TABLE_NAME = process.env.DYNAMO_DB_TABLENAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

const handler = async (event) => {
  const { time: eventTime } = event;
  const { 'instance-id': instanceId, state: instanceState } = event.detail;

  if (!instanceId) {
    return {
      statusCode: 400,
      body: 'invalid request. Instance-id is not passed.',
    };
  }

  if (!instanceState) {
    return { statusCode: 400, body: 'invalid request. State is not passed.' };
  }

  const params = {
    TableName: TABLE_NAME,
    Item: marshall({
      [PRIMARY_KEY]: 'ec2Instance#' + instanceId,
      instanceState: instanceState,
      updatedAt: eventTime,
    }),
    ConditionExpression: `attribute_not_exists(${PRIMARY_KEY})`,
    ReturnValues: 'NONE',
  };

  try {
    const putResponse = await db.send(new PutItemCommand(params));
    return { statusCode: 204, body: putResponse };
  } catch (dbError) {
    if (dbError.name !== 'ConditionalCheckFailedException') {
      return { statusCode: 500, body: dbError };
    }
  }

  const updateParams = {
    TableName: TABLE_NAME, // Replace with your DynamoDB table name
    Key: marshall({ [PRIMARY_KEY]: 'ec2Instance#' + instanceId }), // Key of the existing record to update
    UpdateExpression:
      'SET instanceState = :instanceState, updatedAt = :updatedAt', // Update the desired attributes
    ExpressionAttributeValues: marshall({
      ':instanceState': instanceState, // Replace with the updated values
      ':updatedAt': eventTime,
    }),
    ReturnValues: 'ALL_NEW', // Return the updated attributes
  };

  try {
    const updateResponse = await db.send(new UpdateItemCommand(updateParams));
    return { statusCode: 204, body: updateResponse };
  } catch (dbError) {
    return { statusCode: 500, body: dbError };
  }
};

module.exports = {
  handler,
};
