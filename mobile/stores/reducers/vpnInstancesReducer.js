import { createSlice } from '@reduxjs/toolkit';

const vpnInstancesSlice = createSlice({
  name: 'vpnInstances',
  initialState: [],
  reducers: {
    addVpnInstance(state, action) {
      const vpnInstance = action.payload;

      let updated = false;
      const newState = state.map((stateVpnInstance) => {
        if (stateVpnInstance.instanceId === vpnInstance.instanceId) {
          updated = true;
          return vpnInstance;
        }

        return stateVpnInstance;
      });

      if (updated) {
        return newState;
      }

      // if was not updated, add new one
      return [...newState, vpnInstance];
    },
  },
});

export const { addVpnInstance } = vpnInstancesSlice.actions;
export default vpnInstancesSlice.reducer;
