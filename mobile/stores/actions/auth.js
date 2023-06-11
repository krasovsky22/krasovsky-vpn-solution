import { Auth, Hub } from 'aws-amplify';

import {
  setCurrentUser,
  setErrorMessage,
  clearErrorMessage,
  completeInitialization,
} from '@stores/reducers/authReducer';
import { startLoading, completeLoading } from '@reducers/loadingReducer';

let unsubscribe = () => {};
const subscribeToUserEvents = async (dispatch) => {
  unsubscribe = Hub.listen('auth', ({ payload: { event, data } }) => {
    switch (event) {
      case 'signIn':
        dispatch(setCurrentUser(data));
        break;
      case 'signOut':
        dispatch(setCurrentUser(null));
        break;
      case 'customOAuthState':
        console.log('some unhandled custom state', data);
    }
  });
};

export const unsubscribeToUserEvents = unsubscribe;

export const fetchCurrentUser = async (dispatch) => {
  subscribeToUserEvents(dispatch);
  dispatch(startLoading('Fetching user session...'));

  try {
    const user = await Auth.currentAuthenticatedUser();
    dispatch(setCurrentUser(user));
  } catch (e) {
    console.warn('No user found.');
  }

  dispatch(completeInitialization());
  dispatch(completeLoading());
};

export const signOut = async (dispatch) => {
  dispatch(startLoading('Signing out...'));
  await Auth.signOut();

  dispatch(completeLoading());
};

export const signIn = (username, password) => {
  return async (dispatch) => {
    dispatch(startLoading('Signing in...'));
    try {
      await Auth.signIn(username, password);
      dispatch(clearErrorMessage());
    } catch (error) {
      dispatch(setErrorMessage(error.message));
    }

    dispatch(completeLoading());
  };
};
