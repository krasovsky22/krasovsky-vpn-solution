/** will convert uploads/test.HEIC into test */
export const generateJpegFileName = (originalFilePath: string): string => {
  // remove all subpathes
  const pathArr = originalFilePath.split('/');
  const fileName = pathArr[pathArr.length - 1];
  // remove extention
  const extentionSplit = fileName.split('.');
  return extentionSplit[0] + '.JPEG';
};
