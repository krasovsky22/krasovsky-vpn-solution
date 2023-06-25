export const getFileNameFromPath = (fullPath: string): string => {
  return fullPath.substring(fullPath.lastIndexOf('/') + 1);
};
