import {
  loadVpnInstances,
  subscribeToVpnInstancesUpdates,
} from '@api/vpnInstances';
import {
  startVpnInstance as startVpnInstanceAction,
  stopVpnInstance as stopVpnInstanceAction,
} from '@api/vpnInstances';
import { delay } from '@utils';
import { addVpnInstance } from '@reducers/vpnInstancesReducer';
import { startLoading, completeLoading } from '@reducers/loadingReducer';

let unsubscribe = () => {};
const subscribeToVpnInstancesEvents = async (dispatch) => {
  const sub = subscribeToVpnInstancesUpdates((updatedVpnInstance) => {
    const addVpnInstanceThunk = addVpnInstance(updatedVpnInstance);
    return dispatch(addVpnInstanceThunk);
  });

  unsubscribe = () => sub.unsubscribe();
};

export const fetchVpnInstances = async (dispatch) => {
  dispatch(startLoading('Fetching vpn instances...'));

  const vpnInstances = await loadVpnInstances();

  vpnInstances.forEach((vpnInstance) => {
    const addVpnInstanceThunk = addVpnInstance(vpnInstance);
    return dispatch(addVpnInstanceThunk);
  });

  subscribeToVpnInstancesEvents(dispatch);
  dispatch(completeLoading());
};

export const unSubscribeToVpnInstancesEvents = unsubscribe;

export const startVpnInstance = (instanceId) => {
  return async (dispatch) => {
    dispatch(startLoading(`Starting instance ${instanceId}...`));
    await startVpnInstanceAction(instanceId);

    // delay is to mimick cloud watch event on aws
    await delay(2000);
    dispatch(completeLoading());
  };
};

export const stopVpnInstance = (instanceId) => {
  return async (dispatch) => {
    dispatch(startLoading(`Stopping instance ${instanceId}...`));
    await stopVpnInstanceAction(instanceId);


    // delay is to mimick cloud watch event on aws
    await delay(2000);
    dispatch(completeLoading());
  };
};
