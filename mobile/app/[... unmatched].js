import { Unmatched } from 'expo-router';
import { View } from 'react-native';

export default function BadRoute() {
  console.log('bad');
  return <View>Bad Route</View>;
}
