import { Image } from '@rneui/themed';
import { Stack } from 'expo-router';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import usePhotos from '@hooks/usePhotos';
import useCurrentUser from '@hooks/useCurrentUser';
import { fetchPersonPhotos } from '@actions/photos';

export default function PhotosPage() {
  const photos = usePhotos();
  const dispatch = useDispatch();
  const { attributes } = useCurrentUser();
  const photoPersonId = attributes['custom:photo_person_id'];

  useEffect(() => {
    const fetchCurrentUserPhotosThunk = fetchPersonPhotos(photoPersonId);
    dispatch(fetchCurrentUserPhotosThunk);
  }, [photoPersonId]);

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
            source={{ uri: item.s3PresignedUrl }}
            containerStyle={styles.item}
            placeholderStyle={styles.loadingBox}
            PlaceholderContent={<ActivityIndicator />}
          />
        )}
      />
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
