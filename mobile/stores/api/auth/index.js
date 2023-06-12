import { Auth, Hub } from 'aws-amplify';

export const subscribeToUserEvents = async (callBack) => {
  return Hub.listen('auth', ({ payload: { event, data } }) => {
    switch (event) {
      case 'signIn':
        callBack(callBack(data));
        break;
      case 'signOut':
        callBack(callBack(null));
        break;
      case 'customOAuthState':
        console.log('some unhandled custom state', data);
    }
  });
};

export const getCurrentUser = async () => {
  try {
    return await Auth.currentAuthenticatedUser();
  } catch (e) {
    console.warn('No user found.');
  }

  return null;
};

export const signIn = async (username, password) => {
  try {
    await Auth.signIn(username, password);
  } catch (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
};

export const signOut = async () => {
  return await Auth.signOut();
};
