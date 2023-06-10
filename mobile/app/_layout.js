// import { Provider } from '@context/auth';
import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Footer from '@components/footer';
import appStore from '@stores/appStore';
import LoadingWrapper from '@components/loadingWrapper';
import ProtectedRoute from '@components/protectedRoute';

// Prevent hiding the splash screen
SplashScreen.preventAutoHideAsync();

export default function Root() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="#61dafb" />
        <Provider store={appStore}>
          <ProtectedRoute>
            <LoadingWrapper>
              <View style={styles.content}>
                <Slot />
                <Footer />
              </View>
            </LoadingWrapper>
          </ProtectedRoute>
        </Provider>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: StatusBar.currentHeight || 0,
    flex: 1,
  },
});
