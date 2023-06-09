import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet } from 'react-native';

import { useAuth } from '@context/auth';
import { Button } from '@rneui/themed';
import { useCallback } from 'react';

const Footer = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleRedirect = useCallback((route) => {
    router.replace(route);
  }, []);

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.footer}>
      <Button
        onPress={() => handleRedirect('/')}
        title="Home"
        icon={{
          type: 'MaterialCommunityIcons',
          name: 'home',
          color: 'white',
          size: 20,
        }}
        buttonStyle={{
          borderColor: 'transparent',
          backgroundColor: '#40c72b',
        }}
        containerStyle={{
          marginHorizontal: 50,
          marginVertical: 10,
          paddingRight: 10,
        }}
      />
      <Button
        onPress={() => handleRedirect('/vpn')}
        title="VPN"
        icon={{
          type: 'MaterialIcons',
          name: 'vpn-lock',
          color: 'white',
          size: 20,
        }}
        buttonStyle={{
          borderColor: 'transparent',
          backgroundColor: 'rgba(199, 43, 98, 1)',
        }}
        containerStyle={{
          marginHorizontal: 50,
          marginVertical: 10,
          paddingRight: 10,
        }}
      />
      <Button
        onPress={signOut}
        title="Sign Out"
        icon={{
          type: 'MaterialCommunityIcons',
          name: 'exit-to-app',
          color: 'white',
          size: 20,
        }}
        buttonStyle={{
          backgroundColor: 'black',
        }}
        containerStyle={{
          borderWidth: 0,
          marginVertical: 10,
          marginHorizontal: 50,
        }}
      />
    </SafeAreaView>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'gray',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
});
