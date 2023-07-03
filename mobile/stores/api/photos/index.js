import { API, graphqlOperation } from 'aws-amplify';
import {
  getPersonPhotos as getPersonPhotosQuery,
  getPhotoById as getPhotoByIdQuery,
} from '@graphql/queries/photos';

export const getPersonPhotos = async (personId) => {
  const { data } = await API.graphql(
    graphqlOperation(getPersonPhotosQuery, { personId })
  );
  return data?.getPersonPhotos?.photosWithPerson ?? [];
};

export const getPhotoById = async (photoId) => {
  const { data } = await API.graphql(
    graphqlOperation(getPhotoByIdQuery, { id: photoId })
  );

  return data?.getPhotoById ?? {};
};
