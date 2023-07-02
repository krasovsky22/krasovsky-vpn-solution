import {
  type FaceDetail,
  RekognitionClient,
  DetectFacesCommand,
} from '@aws-sdk/client-rekognition';

type InputType = {
  rekognitionClient: RekognitionClient;
  jpegBuffer: Buffer;
};

export const detectFacesInImage = async ({
  jpegBuffer,
  rekognitionClient,
}: InputType): Promise<FaceDetail[] | null> => {
  try {
    const command = new DetectFacesCommand({
      Image: {
        Bytes: jpegBuffer,
      },
    });

    const rekognitionResponse = await rekognitionClient.send(command);

    return rekognitionResponse?.FaceDetails;
  } catch (error) {
    console.error('ERROR when detecting faces in image ' + error);
    return null;
  }
};
