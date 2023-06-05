import { Amplify, API } from 'aws-amplify';

const config = {
  Auth: {
    region: 'us-west-1',
    userPoolId: 'us-west-1_zg57HrWSW',
    userPoolWebClientId: '4vidoj2s796559rttvt7bc083d',
    mandatorySignIn: true,
  },
};

Amplify.configure(config);

const appSyncConfig = {
  aws_appsync_graphqlEndpoint:
    'https://wivoe67bdrf7lggo6kgtifa5pi.appsync-api.us-west-1.amazonaws.com/graphql',
  aws_appsync_region: 'us-west-1',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
};

Amplify.configure(appSyncConfig);

import 'expo-router/entry';
