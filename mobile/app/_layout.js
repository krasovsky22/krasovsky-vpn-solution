import { Provider } from '@context/auth';
import { Link, Stack, Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View, SafeAreaView, StatusBar, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import ProtectedRoute from '@components/protectedRoute';
import Footer from '@components/Footer';

// Prevent hiding the splash screen
SplashScreen.preventAutoHideAsync();

export default function Root() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="#61dafb" />
        <Provider>
          <ProtectedRoute>
            <View style={styles.content}>
              <Slot />
              <Footer />
            </View>
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
