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

import { API, graphqlOperation } from 'aws-amplify';
import { getVpnInstances } from '@graphql/queries/instances';

const loadVpnInstances = async () => {
  const { data } = await API.graphql(graphqlOperation(getVpnInstances));
  return data?.getVpnInstances ?? [];
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [vpnInstances, setVpnInstances] = useState([]);
  useEffect(() => {
    loadVpnInstances()
      .then((instances) => {
        setVpnInstances(instances);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      <Stack.Screen options={{ title: 'VPN Instances' }} />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={vpnInstances}
          keyExtractor={(item) => item.instanceId}
          renderItem={({ item }) => {
            return (
              <View style={styles.item}>
                <Text style={styles.title}>
                  {item.instanceId} - {item.instanceState}
                </Text>
              </View>
            );
          }}
        />
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
    backgroundColor: 'yellow',
    marginTop: StatusBar.currentHeight || 0,
  },
  container: {
    flex: 3,
    backgroundColor: 'red',
    justifyContent: 'flex-end',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'pink',
  },
});
