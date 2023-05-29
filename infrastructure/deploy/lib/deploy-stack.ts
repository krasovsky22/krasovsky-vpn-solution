import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as events from 'aws-cdk-lib/aws-events';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as eventTargets from 'aws-cdk-lib/aws-events-targets';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

const DYNAMO_DB_PRIMARY_KEY = 'PK';
export class DeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // SQS
    const queue = new sqs.Queue(this, 'Ec2EventsQueue', {
      queueName: 'private-vpn-ec2-events-queue',
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    // DynamoDB
    const dynamoDbTable = new dynamodb.Table(this, 'InstancesStateTable', {
      partitionKey: {
        name: DYNAMO_DB_PRIMARY_KEY,
        type: dynamodb.AttributeType.STRING,
      },
      tableName: 'vpn-instances-state',
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true,
      tableClass: dynamodb.TableClass.STANDARD_INFREQUENT_ACCESS,
    });

    // Lambda
    const lambdaFunction = new lambda.Function(
      this,
      'Ec2EventsLambdaConsumer',
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        functionName: 'Ec2EventsLambdaConsumer',
        code: lambda.Code.fromAsset('../lambda/ec2-events-consumer'),
        handler: 'index.handler',
        environment: {
          PRIMARY_KEY: DYNAMO_DB_PRIMARY_KEY,
          TABLE_NAME: dynamoDbTable.tableName,
        },
      }
    );

    dynamoDbTable.grantReadWriteData(lambdaFunction);
    lambdaFunction.addEventSource(new SqsEventSource(queue));

    const eventRule = new events.Rule(this, 'ec2-instance-state-change-event', {
      enabled: true,
      description: `Event to publich SQS Message when instance state changes`,
      ruleName: `ec2-instance-state-change-event`,
      eventPattern: {
        source: ['aws.ec2'],
        detailType: ['EC2 Instance State-change Notification'],
        detail: {
          'instance-id': ['i-08ac89f026edf5c9d', 'i-0140de9a9f8f9fe66'],
        },
      },
      targets: [new eventTargets.SqsQueue(queue)],
    });

    this.exportValue(queue.queueUrl, { name: 'sqs-queue-url' });
  }
}
