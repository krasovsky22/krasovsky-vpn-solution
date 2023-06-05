import { Text, Pressable } from 'react-native';
import { useAuth } from '@context/auth';

const SignOutButton = () => {
  const { user, signOut } = useAuth();
  if (!user) {
    return null;
  }

  return (
    <Pressable onPress={signOut}>
      <Text>Sign Out</Text>
    </Pressable>
  );
};

export default SignOutButton;
