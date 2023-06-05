/* eslint-disable turbo/no-undeclared-env-vars */
const fetch = require('node-fetch');
const crypto = require('@aws-crypto/sha256-js');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');
const { SignatureV4 } = require('@aws-sdk/signature-v4');
const { HttpRequest } = require('@aws-sdk/protocol-http');

const { Sha256 } = crypto;
const AWS_REGION = process.env.GRAPHQL_AWS_REGION;
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;

const query = /* GraphQL */ `
  mutation createOrUpdateVpnInstance($vpnStateDetails: VpnInstanceInput!) {
    createOrUpdateVpnInstance(vpnStateDetails: $vpnStateDetails) {
      instanceId
      instanceState
    }
  }
`;

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

  const variables = {
    vpnStateDetails: {
      instanceId,
      instanceState,
    },
  };

  //taken from https://docs.amplify.aws/guides/functions/graphql-from-lambda/q/platform/js/#iam-authorization
  const endpoint = new URL(GRAPHQL_ENDPOINT);

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region: AWS_REGION,
    service: 'appsync',
    sha256: Sha256,
  });

  const requestToBeSigned = new HttpRequest({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      host: endpoint.host,
    },
    hostname: endpoint.host,
    body: JSON.stringify({ query, variables }),
    path: endpoint.pathname,
  });

  const signed = await signer.sign(requestToBeSigned);
  const request = new fetch.Request(GRAPHQL_ENDPOINT, signed);

  let statusCode = 200;
  let body;
  let response;

  try {
    response = await fetch(request);
    body = await response.json();
    if (body.errors) statusCode = 400;
  } catch (error) {
    statusCode = 500;
    body = {
      errors: [
        {
          message: error.message,
        },
      ],
    };
  }

  return {
    statusCode,
    body: JSON.stringify(body),
  };
};

module.exports = {
  handler,
};
