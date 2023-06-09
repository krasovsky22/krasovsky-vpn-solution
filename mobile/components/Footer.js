import { Link } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { useAuth } from '@context/auth';
import { SignOutButton } from '@components/buttons';

const Footer = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.footer}>
      <SignOutButton />
      <View style={styles.textContainer}>
        <Link href="/vpn">VPN</Link>
      </View>
    </SafeAreaView>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
});
