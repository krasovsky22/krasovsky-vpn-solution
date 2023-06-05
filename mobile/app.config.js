/* eslint-disable turbo/no-undeclared-env-vars */
const dotenv = require('dotenv');

dotenv.config();

module.exports = ({ config }) => {
  console.log('CONFIG', config.extra.aws); // prints 'My App'

  Object.assign(config.extra.aws, {
    cognito_region: process.env.AWS_COGNITO_REGION,
    cognito_userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    cognito_userPoolWebClientId:
      process.env.AWS_COGNITO_USER_POOL_WEB_CLIENT_ID,
    cognito_mandatorySignIn: process.env.AWS_COGNITO_MANDATORY_SIGN_IN,

    appsync_graphqlEndpoint: process.env.AWSAPP_SYNC_GRAPHQL_ENDPOINT,
    appsync_region: process.env.AWSAPP_SYNC_REGION,
    appsync_authenticationType: process.env.AWSAPP_SYNC_AUTHENTICAION_TYPE,
  });
  return {
    ...config,
  };
};
