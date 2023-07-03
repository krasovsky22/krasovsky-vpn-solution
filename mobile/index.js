import { Amplify, API } from 'aws-amplify';
import Constants from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';

const expoAwsVariables = Constants.expoConfig?.extra?.aws ?? {};
const awsConfig = {
  Auth: {
    region: expoAwsVariables?.cognito_region ?? '',
    userPoolId: expoAwsVariables?.cognito_userPoolId ?? '',
    mandatorySignIn: expoAwsVariables?.cognito_mandatorySignIn ?? true,
    userPoolWebClientId: expoAwsVariables?.cognito_userPoolWebClientId ?? '',
  },
  Storage: {
    AWSS3: {
      bucket: expoAwsVariables?.s3_bucket ?? '',
    },
  },
  aws_appsync_region: expoAwsVariables?.appsync_region ?? '',
  aws_appsync_graphqlEndpoint: expoAwsVariables?.appsync_graphqlEndpoint ?? '',
  aws_appsync_authenticationType:
    expoAwsVariables?.appsync_authenticationType ?? '',
};
Amplify.configure(awsConfig);

SplashScreen.preventAutoHideAsync();

import 'expo-router/entry';
