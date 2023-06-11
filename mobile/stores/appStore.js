import thunkMiddleware from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@reducers/authReducer';
import loadingReducer from '@reducers/loadingReducer';
import vpnInstancesReducer from '@reducers/vpnInstancesReducer';

const appStore = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    vpnInstances: vpnInstancesReducer,
  },
  middleware: [thunkMiddleware],
});

export default appStore;
