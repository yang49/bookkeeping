import * as cdk from '@aws-cdk/core';
import * as path from 'path'
import {AuthorizationType, EndpointType, LambdaIntegration, RestApi, SecurityPolicy} from "@aws-cdk/aws-apigateway";
import {Certificate, CertificateValidation} from '@aws-cdk/aws-certificatemanager';
import {ARecord, HostedZone, RecordTarget} from '@aws-cdk/aws-route53';
import {ApiGateway} from "@aws-cdk/aws-route53-targets";
import {ManagedPolicy, Role, ServicePrincipal} from "@aws-cdk/aws-iam";
import {Tracing} from "@aws-cdk/aws-lambda";
import lambda = require('@aws-cdk/aws-lambda');

interface ApigatewayStackProps extends cdk.StackProps {
}

export class ApigatewayStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: ApigatewayStackProps) {
        super(scope, id, props);
        const domainName = 'zynebula.com';

        const lambdaRole = new Role(this, 'LambdaRole', {
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

        const hostedZone = HostedZone.fromLookup(this, 'ApigatewayHostedZone', {
            domainName: domainName
        });

        const certificate = new Certificate(this, 'apigateway-certificate', {
            domainName: 'api.zynebula.com',
            validation: CertificateValidation.fromDns(hostedZone)
        });

        const testApi = api.root.addResource('test')
        const registrationApi = api.root.addResource('register');

        api.addDomainName('api-gateway-domain', {
            domainName: 'api.zynebula.com',
            endpointType: EndpointType.EDGE,
            certificate: certificate,
            securityPolicy: SecurityPolicy.TLS_1_2
        });

        testApi.addMethod('GET', new LambdaIntegration(fn), {
            authorizationType: AuthorizationType.IAM
        });

        registrationApi.addMethod('POST', new LambdaIntegration(registerFn), {
            authorizationType: AuthorizationType.IAM
        });

        const aRecord = new ARecord( this, "domain_alias_record", {
            recordName:  'api.zynebula.com',
            zone: hostedZone,
            target: RecordTarget.fromAlias(new ApiGateway(api))
        });
    }
}
