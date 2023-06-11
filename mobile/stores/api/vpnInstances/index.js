import { API, graphqlOperation } from 'aws-amplify';
import { getVpnInstances } from '@graphql/queries/vpnInstances';

export const loadVpnInstances = async () => {
  const { data } = await API.graphql(graphqlOperation(getVpnInstances));
  return data?.getVpnInstances ?? [];
};
