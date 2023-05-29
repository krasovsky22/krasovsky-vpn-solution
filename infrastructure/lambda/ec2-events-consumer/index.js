const AWS = require('aws-sdk');

const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

const RESERVED_RESPONSE = `Error: You're using AWS reserved keywords as attributes`;
const DYNAMODB_EXECUTION_ERROR = `Error: Execution update, caused a Dynamodb error, please take a look at your CloudWatch Logs.`;

const db = new AWS.DynamoDB.DocumentClient();

const handler = async (event) => {
  if ((event.Records?.length ?? 0) === 0) {
    return { statusCode: 400, body: 'invalid request.' };
  }

  const record = event.Records[0];

  const message = JSON.parse(record.body);
  const { 'instance-id': instanceId, state: instanceState } = message.detail;

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
    Item: {
      [PRIMARY_KEY]: 'ec2Instance#' + instanceId,
      instanceState: instanceState,
      updatedAt: Math.round(Date.now() / 1000),
    },
    ConditionExpression: `attribute_not_exists(${PRIMARY_KEY})`,
    ReturnValues: 'NONE',
  };

  try {
    const putResponse = await db.put(params).promise();
    return { statusCode: 204, body: putResponse };
  } catch (dbError) {
    if (dbError.code !== 'ConditionalCheckFailedException') {
      return { statusCode: 500, body: dbError };
    }
  }

  const updateParams = {
    TableName: TABLE_NAME, // Replace with your DynamoDB table name
    Key: { [PRIMARY_KEY]: 'ec2Instance#' + instanceId }, // Key of the existing record to update
    UpdateExpression:
      'SET instanceState = :instanceState, updatedAt = :updatedAt', // Update the desired attributes
    ExpressionAttributeValues: {
      ':instanceState': instanceState, // Replace with the updated values
      ':updatedAt': Math.round(Date.now() / 1000),
    },
    ReturnValues: 'ALL_NEW', // Return the updated attributes
  };

  try {
    const updateResponse = await db.update(updateParams).promise();
    return { statusCode: 204, body: updateResponse };
  } catch (dbError) {
    return { statusCode: 500, body: dbError };
  }
};
exports.handler = handler;
