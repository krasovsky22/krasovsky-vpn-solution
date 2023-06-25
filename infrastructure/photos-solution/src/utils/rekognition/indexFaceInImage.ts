import {
  RekognitionClient,
  IndexFacesCommand,
} from '@aws-sdk/client-rekognition';

type InputType = {
  rekognitionClient: RekognitionClient;
  collectionId: string;
  jpegBuffer: Buffer;
};

export const indexFaceInImage = async ({
  jpegBuffer,
  collectionId,
  rekognitionClient,
}: InputType): Promise<string[] | null> => {
  try {
    const indexFacesCommand = new IndexFacesCommand({
      CollectionId: collectionId,
      Image: {
        Bytes: jpegBuffer,
      },
      MaxFaces: 1,
    });

    console.log(
      `executing face indexing command in collection_id ${collectionId}`
    );
    const rekognitionResponse = await rekognitionClient.send(indexFacesCommand);

    return rekognitionResponse?.FaceRecords.map(
      (faceRecord) => faceRecord.Face.FaceId
    );
  } catch (error) {
    console.error('ERROR when indexing face in image ' + error);
    return null;
  }
};
