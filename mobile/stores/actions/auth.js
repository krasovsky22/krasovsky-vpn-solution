import {
  setCurrentUser,
  setErrorMessage,
  clearErrorMessage,
  completeInitialization,
} from '@stores/reducers/authReducer';
import { startLoading, completeLoading } from '@reducers/loadingReducer';

import {
  getCurrentUser,
  signIn as signInApi,
  signOut as signOutApi,
  subscribeToUserEvents,
} from '@api/auth';

let unsubscribe = () => {};
export const unsubscribeToUserEvents = unsubscribe;

export const fetchCurrentUser = async (dispatch) => {
  unsubscribe = subscribeToUserEvents((user) => dispatch(setCurrentUser(user)));
  dispatch(startLoading('Fetching user session...'));

  const user = await getCurrentUser();

  dispatch(setCurrentUser(user));
  dispatch(completeInitialization());
  dispatch(completeLoading());
};

export const signOut = async (dispatch) => {
  dispatch(startLoading('Signing out...'));
  await signOutApi();

  dispatch(completeLoading());
};

export const signIn = (username, password) => {
  return async (dispatch) => {
    dispatch(startLoading('Signing in...'));
    const { success, message } = await signInApi(username, password);

    if (success) {
      dispatch(clearErrorMessage());
    } else {
      dispatch(setErrorMessage(message));
    }

    dispatch(completeLoading());
  };
};
