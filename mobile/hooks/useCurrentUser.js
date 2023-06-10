import { useSelector } from 'react-redux';

const useCurrentUser = () => {
  return useSelector((state) => state.auth.currentUser);
};

export default useCurrentUser;
