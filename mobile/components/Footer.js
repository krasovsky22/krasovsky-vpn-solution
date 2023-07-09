import { useCallback } from 'react';
import { Button } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { View, SafeAreaView, StyleSheet } from 'react-native';

import { signOut } from '@actions/auth';
import useCurrentUser from '@hooks/useCurrentUser';
import { useDispatch } from 'react-redux';

const Footer = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useCurrentUser();

  const handleRedirect = useCallback((route) => {
    router.replace(route);
  }, []);

  if (!currentUser) {
    return null;
  }

  return (
    <SafeAreaView style={styles.footerContainer}>
      <View style={styles.footerInner}>
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
          onPress={() => handleRedirect('/photos')}
          title="Photos"
          icon={{
            type: 'MaterialIcons',
            name: 'insert-photo',
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
          onPress={() => dispatch(signOut)}
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
      </View>
    </SafeAreaView>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: 'gray',
    height: '10%',
    width: '100%',
  },
  footerInner: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    justifyContent: 'space-evenly',
    marginLeft: '10%',
    marginRight: '10%',
  },
});
