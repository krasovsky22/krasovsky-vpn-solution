import { createSignedFetcher } from 'aws-sigv4-fetch';
import { GraphQLClient, type Variables } from 'graphql-request';

type InputType = {
  query: string;
  variables: Variables;
  graphqlEndpoint: string;
  region: string;
};
export const executeGraphqlFunction = async ({
  query,
  region,
  variables,
  graphqlEndpoint,
}: InputType) => {
  try {
    console.log(
      `Executing graphql query createFaceBaseRecognition with variables - ${JSON.stringify(
        variables,
        null,
        2
      )}`
    );
    const client = new GraphQLClient(graphqlEndpoint, {
      fetch: createSignedFetcher({ service: 'appsync', region }),
    });

    return await client.request(query, variables);
  } catch (error) {
    console.error(
      'Error while executing dynamodb insert though appsync. ' + error
    );

    return error;
  }
};
