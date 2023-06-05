import tw from 'twrnc';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={tw`items-center justify-center flex-1 bg-white`}>
      <Text>Home Page</Text>
      <Link href="/">Go to Main Page</Link>
    </View>
  );
}
