import {
  useRouter,
  useSegments,
  useRootNavigationState,
  SplashScreen,
} from 'expo-router';
import React, { useCallback } from 'react';
import { Auth, Hub } from 'aws-amplify';

const AuthContext = React.createContext(null);

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

export const Provider = (props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const navigationState = useRootNavigationState();

  React.useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload: { event, data } }) => {
      console.log('event', event);
      switch (event) {
        case 'signIn':
          setUser(data);
          break;
        case 'signOut':
          setUser(null);
          router.replace('/auth/sign-in');
          break;
        case 'customOAuthState':
          console.log('some unhandled custom state', data);
          setCustomState(data);
      }
    });

    (async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUser(user);
      } catch (e) {
        console.warn('No user found.');
      }

      setIsInitialized(true);
    })();

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (username, password) => {
    await Auth.signIn(username, password);
  }, []);

  const signOut = useCallback(async () => {
    await Auth.signOut();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
      }}
    >
      {!isInitialized && navigationState?.key ? (
        <SplashScreen />
      ) : (
        props.children
      )}
    </AuthContext.Provider>
  );
};
