import {
  type FaceMatch,
  RekognitionClient,
  SearchFacesByImageCommand,
} from '@aws-sdk/client-rekognition';

type InputType = {
  jpegBuffer: Buffer;
  collectionId: string;
  rekognitionClient: RekognitionClient;
};

export const searchFacesInImage = async ({
  collectionId,
  jpegBuffer,
  rekognitionClient,
}: InputType): Promise<FaceMatch[] | null> => {
  try {
    const command = new SearchFacesByImageCommand({
      CollectionId: collectionId,
      Image: {
        Bytes: jpegBuffer,
      },
      MaxFaces: 1,
    });

    const rekognitionResponse = await rekognitionClient.send(command);
    return rekognitionResponse?.FaceMatches;
  } catch (error) {
    console.error('ERROR when searching faces in image ' + error);
    return null;
  }
};
