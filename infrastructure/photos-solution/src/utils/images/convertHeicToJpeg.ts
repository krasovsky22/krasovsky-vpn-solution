import convert from 'heic-convert';

export const convertHeicToJpeg = async (
  heicBuffer: Buffer
): Promise<Buffer | null> => {
  try {
    return await convert({
      buffer: heicBuffer,
      format: 'JPEG',
      quality: 0.8, // Adjust the quality value as needed
    });
  } catch (error) {
    console.error('HEICO TO JPEG ERROR:' + error);

    return null;
  }
};
