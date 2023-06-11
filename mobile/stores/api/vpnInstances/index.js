import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from '@graphql/mutations/vpnInstances';
import { getVpnInstances } from '@graphql/queries/vpnInstances';
import { vpnInstanceUpdated } from '@graphql/subscriptions/vpnInstances';

export const loadVpnInstances = async () => {
  const { data } = await API.graphql(graphqlOperation(getVpnInstances));
  return data?.getVpnInstances ?? [];
};

export const subscribeToVpnInstancesUpdates = (callBack) => {
  return API.graphql(graphqlOperation(vpnInstanceUpdated)).subscribe({
    next: ({ value }) => {
      console.log('subscription event', value);
      const updatedVpnInstance = value.data.vpnInstanceUpdated;
      callBack(updatedVpnInstance);
    },
    error: (error) => console.warn(JSON.stringify(error)),
  });
};

export const startVpnInstance = async (instanceId) => {
  return await API.graphql({
    query: mutations.startVpnInstance,
    variables: { instanceId },
  });
};

export const stopVpnInstance = async (instanceId) => {
  return await API.graphql({
    query: mutations.stopVpnInstance,
    variables: { instanceId },
  });
};
