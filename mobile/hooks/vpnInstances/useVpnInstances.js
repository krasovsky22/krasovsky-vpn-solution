import { useState, useEffect } from 'react';
import { loadVpnInstances } from '@api/vpnInstances';

import { API, graphqlOperation } from 'aws-amplify';
import { vpnInstanceUpdated } from '@graphql/subscriptions/vpnInstances';

const useVpnInstances = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [vpnInstances, setVpnInstances] = useState(new Map());

  useEffect(() => {
    const updateOrAddVpnInstance = (vpnInstance) => {
      const { instanceId, ...rest } = vpnInstance;
      setVpnInstances(
        (previousMap) => new Map(previousMap.set(instanceId, { ...rest }))
      );
    };

    // load initial instances
    loadVpnInstances()
      .then((instances) => {
        instances.forEach((instance) => updateOrAddVpnInstance(instance));
      })
      .finally(() => {
        setIsLoading(false);
      });

    const sub = API.graphql(graphqlOperation(vpnInstanceUpdated)).subscribe({
      next: ({ value }) => {
        const updatedVpnInstance = value.data.vpnInstanceUpdated;
        updateOrAddVpnInstance(updatedVpnInstance);
      },
      error: (error) => console.warn(JSON.stringify(error)),
    });

    // Stop receiving data updates from the subscription
    return () => sub.unsubscribe();
  }, []);

  return { vpnInstances, isLoading };
};

export default useVpnInstances;
