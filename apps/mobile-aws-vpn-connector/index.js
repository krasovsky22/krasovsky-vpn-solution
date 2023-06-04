import Amplify from '@aws-amplify/core';

Amplify.configure({
  Auth: {
    region: 'us-west-1',
    userPoolId: 'us-west-1_zg57HrWSW',
    userPoolWebClientId: '4vidoj2s796559rttvt7bc083d',
    mandatorySignIn: true,
  },
});

import 'expo-router/entry';
