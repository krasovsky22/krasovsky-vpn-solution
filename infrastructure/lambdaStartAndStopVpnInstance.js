const AWS = require('@aws-sdk/client-ec2');
const ec2 = new AWS.EC2();

exports.handler = async (event, context) => {
  const { instanceId, action } = event;

  if (!instanceId) {
    return {
      statusCode: 500,
      body: `InstanceId is required.`,
    };
  }

  if (['start', 'stop'].includes(action) === false) {
    return {
      statusCode: 500,
      body: `Incorrect Action`,
    };
  }

  const params = {
    InstanceIds: [instanceId],
  };

  try {
    if (action === 'start') {
      await ec2.startInstances(params);
    }

    if (action === 'stop') {
      await ec2.stopInstances(params);
    }

    return {
      statusCode: 200,
      body: `EC2 instance ${
        action === 'start' ? 'started' : 'stopped'
      } successfully`,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error ${
        action === 'start' ? 'started' : 'stopped'
      } EC2 instance: ${error.message}`,
    };
  }
};
