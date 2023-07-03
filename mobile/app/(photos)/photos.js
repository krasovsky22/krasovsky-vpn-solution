import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
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

  console.log('asdasd', photos);
  return (
    <View>
      <Stack.Screen options={{ title: 'Person Photos' }} />
      <Text>Photos Page</Text>
    </View>
  );
}
