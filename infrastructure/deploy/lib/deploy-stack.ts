import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class DeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    const queue = new sqs.Queue(this, 'Ec2EventsQueue', {
      queueName: 'private-vpn-ec2-events-queue',
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    const handler = new lambda.Function(this, 'Ec2EventsLambdaConsumer', {
      runtime: lambda.Runtime.NODEJS_16_X,
      functionName: 'Ec2EventsLambdaConsumer',
      code: lambda.Code.fromAsset('../lambda/ec2-events-consumer'),
      handler: 'index.handler'
    });

    handler.addEventSource(new SqsEventSource(queue));

    this.exportValue(queue.queueUrl, { name: 'sqs-queue-url'});
  }
}
