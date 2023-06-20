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
import * as ImagePicker from 'expo-image-picker';
import { Stack } from 'expo-router';
import { Button, Image, Card, ListItem } from '@rneui/themed';

export default function App() {
  const [images, setImages] = useState([]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      allowsMultipleSelection: true,
    });

    console.log('results', result);

    if (!result.canceled) {
      setImages(result.assets);
    }
  };

  return (
    <View style={styles.pageContainer}>
      <SafeAreaView>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {images.map((image) => (
          <Image
            key={image.uri}
            source={{ uri: image.uri }}
            style={{ width: 200, height: 200 }}
            alt="image"
          />
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
