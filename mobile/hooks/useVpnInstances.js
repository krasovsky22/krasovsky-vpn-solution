import { useSelector } from 'react-redux';

const useVpnInstances = () => {
  return useSelector((state) => state.vpnInstances);
};

export default useVpnInstances;
