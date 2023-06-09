import {
  useRouter,
  useSegments,
  useRootNavigationState,
  SplashScreen,
} from 'expo-router';
import React from 'react';
import { useAuth } from '@context/auth';

const ProtectedRoute = ({ children, ...rest }) => {
  const { user } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  const inAuthGroup = segments[0] === '(auth)';

  React.useEffect(() => {
    if (!navigationState?.key) {
      // Temporary fix for router not being ready.
      return;
    }

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace('/sign-in');
    }

    if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/');
    }
  }, [user, navigationState?.key, inAuthGroup, router]);

  return children;
};

export default ProtectedRoute;
