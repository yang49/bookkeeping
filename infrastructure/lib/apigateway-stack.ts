import * as cdk from '@aws-cdk/core';
import * as path from 'path'
import {AuthorizationType, EndpointType, LambdaIntegration, RestApi, SecurityPolicy} from "@aws-cdk/aws-apigateway";
import {Certificate} from '@aws-cdk/aws-certificatemanager';
import {ARecord, IHostedZone, RecordTarget} from '@aws-cdk/aws-route53';
import {ApiGateway} from "@aws-cdk/aws-route53-targets";
import {ManagedPolicy, Role, ServicePrincipal} from "@aws-cdk/aws-iam";
import lambda = require('@aws-cdk/aws-lambda');
import {Construct} from "@aws-cdk/core";

interface ApigatewayStackProps extends cdk.StackProps {
    readonly certificate: Certificate,
    readonly hostedZone: IHostedZone,
    readonly isProd: boolean
}

export class ApigatewayStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: ApigatewayStackProps) {
        super(scope, id, props);

        const lambdaRoleId = props.isProd ? 'LambdaRole' : 'TestLambdaRole';
        const lambdaRole = new Role(this, lambdaRoleId, {
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'),
                ManagedPolicy.fromAwsManagedPolicyName('CloudWatchFullAccess'),
                ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaInsightsExecutionRolePolicy')
            ]
        });

        const fn = new lambda.Function(this, 'MyFunction', {
            functionName: "TestFunction",
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(path.join(process.cwd(), 'lambdaFunctions/test-handler')),
            role: lambdaRole
        });

        const registerFn = new lambda.Function(this, 'registerFunction', {
            functionName: "RegisterFunction",
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(path.join(process.cwd(),
                'lambdaFunctions/user-registration-handler')),
            role: lambdaRole,
        });

        const api = new RestApi(this, 'TestApi', {
            deploy: true,
            deployOptions: {
                stageName: 'dev'
            },
            endpointTypes: [EndpointType.EDGE],
        });

        const testApi = api.root.addResource('test')
        const registrationApi = api.root.addResource('register');

        const apiDomainNameId = props.isProd ? 'api-gateway-domain' : 'test-api-gateway-domain';
        api.addDomainName(apiDomainNameId, {
            domainName: props.isProd ? 'api.zynebula.com' : 'apitest.zynebula.com',
            endpointType: EndpointType.EDGE,
            certificate: props.certificate,
            securityPolicy: SecurityPolicy.TLS_1_2
        });

        testApi.addMethod('GET', new LambdaIntegration(fn), {
            authorizationType: AuthorizationType.IAM
        });

        registrationApi.addMethod('POST', new LambdaIntegration(registerFn), {
            authorizationType: AuthorizationType.IAM
        });

        const recordId = props.isProd ? 'domain_alias_record' : 'test-domain_alias_record';
        new ARecord( this, recordId, {
            recordName: props.isProd ? 'api.zynebula.com' : 'apitest.zynebula.com',
            zone: props.hostedZone,
            target: RecordTarget.fromAlias(new ApiGateway(api))
        });
    }
}
