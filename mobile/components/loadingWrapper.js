import { useSelector } from 'react-redux';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import useIsLoading from '@hooks/useIsLoading';

const LoadingWrapper = ({ children }) => {
  const { isLoading, loadingAction } = useIsLoading();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>{loadingAction}</Text>
      </View>
    );
  }

  return children;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: StatusBar.currentHeight || 0,
  },
});

export default LoadingWrapper;
