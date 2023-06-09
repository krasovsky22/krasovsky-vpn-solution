import tw from 'twrnc';
import { Stack } from 'expo-router';
import { Text, View, StatusBar } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Page</Text>
      <Link href="/">Go to Main Page</Link>
    </View>
  );
}
