import { useSelector } from 'react-redux';

const usePhotos = () => {
  return useSelector((state) => state.photos);
};

export default usePhotos;
