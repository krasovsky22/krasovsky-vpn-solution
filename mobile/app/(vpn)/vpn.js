import { Stack } from 'expo-router';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { Button, ListItem } from '@rneui/themed';

import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchVpnInstances } from '@actions/vpnInstances';
import useVpnInstances from '@hooks/useVpnInstances';
import { startVpnInstance, stopVpnInstance } from '@api/vpnInstances';

export default function VpnPage() {
  const dispatch = useDispatch();
  const vpnInstances = useVpnInstances();

  useEffect(() => {
    if (vpnInstances.length) {
      return;
    }

    dispatch(fetchVpnInstances);
  }, [vpnInstances]);

  const handleActionButtonCallback = useCallback(async (vpnInstance) => {
    const { instanceId, instanceState } = vpnInstance;
    const fn = instanceState === 'stopped' ? startVpnInstance : stopVpnInstance;

    const response = await fn(instanceId);
    console.log('response', response);
  }, []);

  return (
    <View style={styles.pageContainer}>
      <Stack.Screen options={{ title: 'VPN Instances' }} />
      <SafeAreaView>
        {vpnInstances.map((vpnInstance) => {
          const { instanceId, instanceState } = vpnInstance;
          const isPendingAction = ['pending', 'stopping'].includes(
            instanceState
          );
          const isStopped = instanceState === 'stopped';

          return (
            <View key={instanceId} style={styles.listItemContainer}>
              <ListItem bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>{instanceId}</ListItem.Title>
                  <ListItem.Subtitle>{instanceState}</ListItem.Subtitle>
                </ListItem.Content>
                <Button
                  disabled={isPendingAction}
                  onPress={() => handleActionButtonCallback(vpnInstance)}
                >
                  {isStopped ? 'Start' : 'Stop'}
                </Button>
              </ListItem>
            </View>
          );
        })}
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
