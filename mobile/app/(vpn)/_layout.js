import { Slot } from 'expo-router';
import { View, Text } from 'react-native';

export default function VpnLayout() {
  return (
    <View>
      <Text>Vpn Layout</Text>
      <View>
        <Slot />
      </View>
    </View>
  );
}
