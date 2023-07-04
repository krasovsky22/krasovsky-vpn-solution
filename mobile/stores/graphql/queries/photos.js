export const getPersonPhotos = `
query getPersonPhotosQuery($personId: ID!) {
  getPersonPhotos(personId: $personId) {
    photosWithPerson {
      personId
      photoId
      dimensions
    }
    firstName
    createdAt
    id
    lastName
  }
}
`;

export const getPhotoById = `
query getPhotoByIdQuery($id: ID!) {
  getPhotoById(id: $id) {
    id
    s3Path
    createdAt
    s3PresignedUrl
  }
}
`;
