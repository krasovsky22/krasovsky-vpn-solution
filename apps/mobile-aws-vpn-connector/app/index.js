import tw from 'twrnc';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function App() {
  return (
    <View style={tw`items-center justify-center flex-1 bg-white`}>
      <Text>Hello Boss</Text>
      <Link href="/home">Home</Link>
      <StatusBar style="auto" />
    </View>
  );
}
