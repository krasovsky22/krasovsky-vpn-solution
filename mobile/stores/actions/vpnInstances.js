import { loadVpnInstances } from '@api/vpnInstances';
import { addVpnInstance } from '@reducers/vpnInstancesReducer';
import { startLoading, completeLoading } from '@reducers/loadingReducer';

export const fetchVpnInstances = async (dispatch) => {
  dispatch(startLoading('Fetching vpn instances...'));

  const vpnInstances = await loadVpnInstances();

  vpnInstances.forEach((vpnInstance) => {
    const addVpnInstanceThunk = addVpnInstance(vpnInstance);
    return dispatch(addVpnInstanceThunk);
  });

  dispatch(completeLoading());
};
