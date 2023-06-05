import { Link, Stack } from 'expo-router';
import { Provider } from '@context/auth';
import { StyleSheet, View, SafeAreaView, StatusBar, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import { SignOutButton } from '@components/buttons';

// Prevent hiding the splash screen
SplashScreen.preventAutoHideAsync();

export default function Root() {
  return (
    <Provider>
      <Stack initialRouteName="index" />
      <StatusBar backgroundColor="#61dafb" />
      <SafeAreaView style={styles.footer}>
        <SignOutButton />
        <View style={styles.textContainer}>
          <Link href="/home">Home</Link>
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 20,
  },
  footer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
});
