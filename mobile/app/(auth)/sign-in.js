import { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Slot, Stack, Tabs } from 'expo-router';

import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '@context/auth';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { signIn } = useAuth();

  const submitLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
    setIsLoading(false);
  }, [email, password, signIn]);

  if (isLoading) {
    return (
      <View style={styles.wrapper}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Image
          alt="logo"
          style={styles.image}
          source={require('@assets/logo.png')}
        />

        <StatusBar style="auto" />
        <View style={styles.inputView}>
          <TextInput
            autoFocus
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            style={styles.TextInput}
            placeholder="Email."
            placeholderTextColor="#003f5c"
            onChangeText={(email) => setEmail(email)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            autoCapitalize="none"
            style={styles.TextInput}
            textContentType="password"
            placeholder="Password."
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>
        <View>
          <Text>{error}</Text>
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={submitLogin}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    gap: '20px',
  },
  image: {
    // height: '10pt',
    // width: '100%',
  },
  inputView: {
    backgroundColor: '#FFC0CB',
    borderRadius: 30,
    width: '70%',
    height: 45,
    alignItems: 'center',
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  loginBtn: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF1493',
  },
});
