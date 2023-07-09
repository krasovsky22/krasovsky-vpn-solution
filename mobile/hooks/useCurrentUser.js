import { useSelector } from 'react-redux';

const useCurrentUser = (attribute = null) => {
  const user = useSelector((state) => state.auth.currentUser);

  if (attribute) {
    return user?.attributes[attribute];
  }

  return user;
};

export default useCurrentUser;
