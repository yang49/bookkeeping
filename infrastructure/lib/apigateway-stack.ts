import * as cdk from '@aws-cdk/core';
import * as path from 'path'
import {AuthorizationType, LambdaIntegration, RestApi} from "@aws-cdk/aws-apigateway";
import lambda = require('@aws-cdk/aws-lambda');

interface ApigatewayStackProps extends cdk.StackProps {
    // stage: "staging" | "production";
    // functionArn: string;
    // domainName: string;
    // domainNameAliasHostedZoneId: string;
    // domainNameAliasTarget: string;
}

export class ApigatewayStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: ApigatewayStackProps) {
        super(scope, id, props);
        const lambdaPath = path.join(process.cwd(), 'lambdaFunctions/test-handler');
        const fn = new lambda.Function(this, 'MyFunction', {
            functionName: "TestFunction",
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(lambdaPath),
        });

        const api = new RestApi(this, 'TestApi', {
            deployOptions: {
                stageName: 'dev'
            }
        });
        api.root.addMethod('GET', new LambdaIntegration(fn), {
            authorizationType: AuthorizationType.IAM
        });
    }
}
