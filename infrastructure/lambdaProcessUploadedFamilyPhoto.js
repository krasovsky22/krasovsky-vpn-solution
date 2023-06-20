/* eslint-disable turbo/no-undeclared-env-vars */
const AWS = require('@aws-sdk/client-rekognition');
const client = new AWS.Rekognition();

const S3_BUCKET = process.env.PHOTOS_S3_BUCKET;

const handler = async (event) => {
  console.log(JSON.stringify(event));
  const statusCode = 200;
  return {
    statusCode,
    body: JSON.stringify(event),
  };
};

module.exports = {
  handler,
};
