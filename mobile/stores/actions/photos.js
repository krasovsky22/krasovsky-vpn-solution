import { startLoading, completeLoading } from '@reducers/loadingReducer';
import { getPersonPhotos, getPhotoById } from '@api/photos';
import { setPhotos } from '@reducers/photosReducer';

export const fetchPersonPhotos = (personId) => {
  return async (dispatch) => {
    dispatch(startLoading('Loading photos...'));

    const personPhotos = await getPersonPhotos(personId);

    const photos = await Promise.all(
      personPhotos.map(({ photoId }) => {
        return getPhotoById(photoId);
      })
    );

    dispatch(setPhotos(photos));

    dispatch(completeLoading());
  };
};
