import { startLoading, completeLoading } from '@reducers/loadingReducer';
import { getPersonPhotos, getPhotoById } from '@api/photos';
import { addPhoto } from '@reducers/photosReducer';

export const fetchPersonPhotos = (personId) => {
  return async (dispatch) => {
    dispatch(startLoading('Loading photos...'));

    const personPhotos = await getPersonPhotos(personId);

    console.log('eeeee', personPhotos);

    const photos = await Promise.all(
      personPhotos.map(({ photoId }) => {
        return getPhotoById(photoId);
      })
    );

    photos.forEach((photo) => {
      const addPhotoThunk = addPhoto(photo);
      return dispatch(addPhotoThunk);
    });

    dispatch(completeLoading());
  };
};
