import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import React from 'react';
import useCurrentUser from '@hooks/useCurrentUser';
import {
  fetchCurrentUser,
  unsubscribeToUserEvents,
} from '@stores/actions/auth';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const currentUser = useCurrentUser();
  const { isInitialized } = useSelector((state) => state.auth);

  const router = useRouter();
  const segments = useSegments();
  const navigation = useNavigation();
  const navigationState = useRootNavigationState();

  const inAuthGroup = segments[0] === '(auth)';

  React.useEffect(() => {
    dispatch(fetchCurrentUser);

    return () => unsubscribeToUserEvents();
  }, []);

  React.useEffect(() => {
    if (!navigationState?.key) {
      return;
    }

    if (!router) {
      return;
    }

    if (!isInitialized) {
      return;
    }

    if (!navigation.isReady()) {
      return;
    }
    if (!currentUser && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace('/sign-in');
    }

    if (currentUser && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/');
    }
  }, [
    navigationState?.key,
    currentUser,
    inAuthGroup,
    isInitialized,
    router,
    navigation,
  ]);

  return children;
};

export default ProtectedRoute;
