import { Stack } from 'expo-router';
import { Image, Dialog, Text } from '@rneui/themed';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Image as NativeImage,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import usePhotos from '@hooks/usePhotos';
import useCurrentUser from '@hooks/useCurrentUser';
import { fetchPersonPhotos } from '@actions/photos';

export default function PhotosPage() {
  const photos = usePhotos();
  const dispatch = useDispatch();
  const photoPersonId = useCurrentUser('custom:photo_person_id');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchCurrentUserPhotosThunk = fetchPersonPhotos(photoPersonId);
    dispatch(fetchCurrentUserPhotosThunk);
  }, [dispatch, photoPersonId]);

  console.log('eee', selectedPhoto);

  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: 'Person Photos' }} />
      <FlatList
        data={photos}
        style={styles.list}
        numColumns={2}
        renderItem={({ item }) => (
          <Image
            key={item.id}
            alt="photo"
            onPress={() => setSelectedPhoto(item)}
            source={{ uri: item.s3PresignedUrl }}
            containerStyle={styles.item}
            placeholderStyle={styles.loadingBox}
            PlaceholderContent={<ActivityIndicator />}
          />
        )}
      />
      <Dialog
        isVisible={selectedPhoto !== null}
        onBackdropPress={() => setSelectedPhoto(null)}
        overlayStyle={{
          height: '110%',
          width: '110%',
          backgroundColor: 'transparent',
        }}
        onPressIn={() => {
          console.log('press in');
        }}
        fullScreen
      >
        <TouchableHighlight onPress={() => setSelectedPhoto(null)}>
          <NativeImage
            alt={selectedPhoto?.id}
            style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
            source={{ uri: selectedPhoto?.s3PresignedUrl }}
            onPress={() => setSelectedPhoto(null)}
          />
        </TouchableHighlight>
      </Dialog>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: '100%',
    backgroundColor: '#000',
  },
  item: {
    aspectRatio: 1,
    width: '100%',
    flex: 1,
  },
});
