import * as cdk from '@aws-cdk/core';
import { ApigatewayStack } from "./apigateway-stack";
import {DynamoStack} from "./dynamo-stack";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    // The code that defines your stack goes here
    new ApigatewayStack(this, 'ApigatewayStack', props);
    new DynamoStack(this, 'DatabaseStack', props);
  }
}
