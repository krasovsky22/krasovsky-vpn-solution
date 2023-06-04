import { Slot } from 'expo-router';
import { Provider } from '@context/auth';
import tw from 'twrnc';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Prevent hiding the splash screen
SplashScreen.preventAutoHideAsync();

export default function Root() {
  return (
    <View style={styles.container}>
      <Provider>
        <Slot />
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    marginBottom: 40,
  },
});
