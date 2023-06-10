import { Stack } from 'expo-router';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';

import { ListItem } from '@rneui/themed';

import useVpnInstances from '@hooks/vpnInstances/useVpnInstances';

export default function VpnPage() {
  const { vpnInstances, isLoading } = useVpnInstances();
  return (
    <View style={styles.pageContainer}>
      <Stack.Screen options={{ title: 'VPN Instances' }} />
      <SafeAreaView>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>John Doe</ListItem.Title>
            <ListItem.Subtitle>CEO, Example.com</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>

        {/* <FlatList
          data={[...vpnInstances.keys()]}
          renderItem={({ item: instanceId }) => {
            const { instanceState } = vpnInstances.get(instanceId);
            return (
              <View style={styles.item}>
                <Text style={styles.title}>
                  {instanceId} - {instanceState}
                </Text>
              </View>
            );
          }}
        /> */}
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
