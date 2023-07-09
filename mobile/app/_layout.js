// import { Provider } from '@context/auth';
import * as Font from 'expo-font';
import { Provider } from 'react-redux';
import { Navigator, Slot } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useCallback } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Footer from '@components/footer';
import appStore from '@stores/appStore';
import LoadingWrapper from '@components/loadingWrapper';
import ProtectedRoute from '@components/protectedRoute';

// Prevent hiding the splash screen
SplashScreen.preventAutoHideAsync();

export default function Root() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Entypo.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Navigator>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <StatusBar backgroundColor="#61dafb" />
          <Provider store={appStore}>
            <ProtectedRoute>
              <View style={styles.content}>
                <LoadingWrapper>
                  <Slot />
                </LoadingWrapper>
                <Footer />
              </View>
            </ProtectedRoute>
          </Provider>
        </View>
      </Navigator>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: StatusBar.currentHeight || 0,
    flex: 1,
  },
});
