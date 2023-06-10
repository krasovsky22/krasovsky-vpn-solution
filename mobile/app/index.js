import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { Card, ListItem } from '@rneui/themed';

export default function App() {
  return (
    <View style={styles.pageContainer}>
      <SafeAreaView>
        <Text>Initial Home Page</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: StatusBar.currentHeight || 0,
  },
  pageContainer: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  //   container: {
  //     flex: 3,
  //     justifyContent: 'flex-end',
  //   },
  //   item: {
  //     backgroundColor: '#f9c2ff',
  //     padding: 20,
  //     marginVertical: 8,
  //   },
  //   textContainer: {
  //     flex: 1,
  //     alignItems: 'center',
  //     backgroundColor: 'pink',
  //   },
});
