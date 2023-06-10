import thunkMiddleware from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/authReducer';
import loadingReducer from './reducers/loadingReducer';

const appStore = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
  },
  middleware: [thunkMiddleware],
});

export default appStore;
