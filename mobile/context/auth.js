import {
  useRouter,
  useSegments,
  useRootNavigationState,
  SplashScreen,
} from 'expo-router';
import React from 'react';
import { Auth, Hub } from 'aws-amplify';

const AuthContext = React.createContext(null);

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user) {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  React.useEffect(() => {
    if (!navigationState?.key) {
      // Temporary fix for router not being ready.
      return;
    }
    const inAuthGroup = segments[0] === '(auth)';

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace('/sign-in');
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/');
    }
  }, [user, segments, navigationState?.key]);
}

export const Provider = (props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [user, setUser] = React.useState(null);
  //   const [user, setAuth] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          setUser(data);
          break;
        case 'signOut':
          setUser(null);
          router.replace('/sign-in');
          break;
        case 'customOAuthState':
          console.log('some unhandled custom state', data);
          setCustomState(data);
      }
    });

    Auth.currentAuthenticatedUser()
      .then((currentUser) => setUser(currentUser))
      .catch(() => console.log('Not signed in'))
      .finally(() => setIsInitialized(true));

    return unsubscribe;
  }, []);

  async function signIn(username, password) {
    await Auth.signIn(username, password);
  }

  async function signOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log('error signing out', error);
    }
  }

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
      }}
    >
      {!isInitialized ? <SplashScreen /> : props.children}
    </AuthContext.Provider>
  );
};
