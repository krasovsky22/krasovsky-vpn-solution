import { Stack } from 'expo-router';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  FlatList,
  Text,
} from 'react-native';
import { Button, ListItem } from '@rneui/themed';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchVpnInstances } from '@actions/vpnInstances';
import useVpnInstances from '@hooks/useVpnInstances';

export default function VpnPage() {
  const dispatch = useDispatch();
  const vpnInstances = useVpnInstances();

  useEffect(() => {
    if (vpnInstances.length) {
      return;
    }

    dispatch(fetchVpnInstances);
  }, [vpnInstances]);

  return (
    <View style={styles.pageContainer}>
      <Stack.Screen options={{ title: 'VPN Instances' }} />
      <SafeAreaView>
        {vpnInstances.map((vpnInstance) => (
          <View key={vpnInstance.instanceId} style={styles.listItemContainer}>
            <ListItem bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{vpnInstance.instanceId}</ListItem.Title>
                <ListItem.Subtitle>
                  {vpnInstance.instanceState}
                </ListItem.Subtitle>
              </ListItem.Content>
              <Button>Start</Button>
            </ListItem>
          </View>
        ))}
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
  listItemContainer: {
    padding: 10,
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
