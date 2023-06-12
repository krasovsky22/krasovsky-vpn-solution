import Spinner from 'react-native-loading-spinner-overlay';

import useIsLoading from '@hooks/useIsLoading';

const LoadingWrapper = ({ children }) => {
  const { isLoading, loadingAction } = useIsLoading();

  return (
    <>
      <Spinner
        visible={isLoading}
        textContent={loadingAction || 'Loading...'}
      />
      {children}
    </>
  );
};

export default LoadingWrapper;
