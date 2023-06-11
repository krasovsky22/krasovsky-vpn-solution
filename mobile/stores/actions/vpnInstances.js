import {
  loadVpnInstances,
  subscribeToVpnInstancesUpdates,
} from '@api/vpnInstances';
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
