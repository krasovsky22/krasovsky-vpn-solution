export const startVpnInstance = `
    mutation startVpnInstance($instanceId: ID!) {
        startVpnInstance(instanceId: $instanceId)
    }
`;

export const stopVpnInstance = `
    mutation stopVpnInstance($instanceId: ID!) {
        stopVpnInstance(instanceId: $instanceId)
    }
`;
