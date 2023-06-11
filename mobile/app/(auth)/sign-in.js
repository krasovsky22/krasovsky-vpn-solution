import { Stack } from 'expo-router';
import { Input, Button } from '@rneui/themed';
import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { signIn } from '@stores/actions/auth';
import { useDispatch, useSelector } from 'react-redux';

export default function SignIn() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const error = useSelector((state) => state.auth.errorMessage);

  const submitLogin = useCallback(async () => {
    const signInThunk = signIn(email, password);
    dispatch(signInThunk);
  }, [email, password]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.imageContainer}>
        <Image
          alt="logo"
          style={styles.image}
          source={require('@assets/logo.png')}
        />
      </View>

      <View style={styles.inputContent}>
        <View style={styles.inputView}>
          <Input
            autoFocus
            keyboardType="email-address"
            textContentType="emailAddress"
            style={styles.TextInput}
            placeholder="Email."
            placeholderTextColor="#003f5c"
            autoCapitalize="none"
            onChangeText={(email) => setEmail(email)}
            leftIcon={{ type: 'fontisto', name: 'email' }}
          />
        </View>
        <View style={styles.inputView}>
          <Input
            autoCapitalize="none"
            style={styles.TextInput}
            textContentType="password"
            placeholder="Password."
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            leftIcon={{ type: 'fontisto', name: 'unlocked' }}
            onChangeText={(password) => setPassword(password)}
          />
        </View>
        <View>
          <Text>{error}</Text>
        </View>
      </View>
      <View style={styles.loginBtnContainer}>
        <Button
          onPress={submitLogin}
          title="Sign In"
          containerStyle={styles.loginBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '30px',
  },

  // IMAGE
  imageContainer: {
    flex: 2,
    width: '70%',
    alignItems: 'center',
  },
  image: {
    height: '50%',
    width: '100%',
    resizeMode: 'contain',
    marginTop: 'auto',
  },

  // INPUTS

  inputContent: {
    flex: 1,
    gap: '20px',
    width: '90%',
  },
  inputView: {
    // backgroundColor: '#FFC0CB',
    // borderRadius: 30,
    width: '100%',
    height: 45,
  },
  TextInput: {
    height: 50,
    flex: 1,
    marginLeft: '10%',
  },

  //   LOGIN BUTTON
  loginBtnContainer: {
    flex: 1,
    width: '80%',
  },
  loginBtn: {
    marginBottom: 'auto',
    width: '100%',
    borderRadius: 25,
  },
});
