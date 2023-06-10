import { useSelector } from 'react-redux';

const useIsLoading = () => {
  return useSelector((state) => state.loading);
};

export default useIsLoading;
