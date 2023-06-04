import { Text, Pressable } from 'react-native';
import { useAuth } from '@context/auth';

const SignOutButton = () => {
  const { user, signOut } = useAuth();
  return (
    <Pressable onPress={signOut}>
      <Text>Hello, {user?.attributes?.email}! Click here to sign out!</Text>
    </Pressable>
  );
};

export default SignOutButton;
