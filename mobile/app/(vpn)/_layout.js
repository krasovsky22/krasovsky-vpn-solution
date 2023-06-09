import { Slot, Stack } from 'expo-router';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function VpnLayout() {
  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1,
        }}
      >
        <StatusBar backgroundColor="#61dafb" />
        <View
          style={{
            flex: 1,
            marginTop: 60,
          }}
        >
          <Text>Vpn Layout</Text>
          <Slot />
        </View>
      </View>
    </SafeAreaProvider>
  );
}
