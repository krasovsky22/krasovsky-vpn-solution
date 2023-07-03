import thunkMiddleware from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@reducers/authReducer';
import loadingReducer from '@reducers/loadingReducer';
import vpnInstancesReducer from '@reducers/vpnInstancesReducer';
import photosReducer from '@reducers/photosReducer';

const appStore = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    photos: photosReducer,
    vpnInstances: vpnInstancesReducer,
  },
  middleware: [thunkMiddleware],
});

export default appStore;
