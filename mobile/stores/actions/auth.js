import { Auth, Hub } from 'aws-amplify';

import {
  setCurrentUser,
  completeInitialization,
} from '@stores/reducers/authReducer';
import { startLoading, completeLoading } from '@stores/reducers/loadingReducer';

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

export const signOut = async () => {
  await Auth.signOut();
};

export const signIn = async (username, password) => {
  await Auth.signIn(username, password);
};
