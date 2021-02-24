import * as cdk from '@aws-cdk/core';
import * as path from 'path'
import {
    AuthorizationType,
    BasePathMapping, DomainName,
    EndpointType,
    LambdaIntegration,
    RestApi,
    SecurityPolicy
} from "@aws-cdk/aws-apigateway";
import {Certificate, CertificateValidation} from '@aws-cdk/aws-certificatemanager';
import {ARecord, HostedZone, RecordTarget} from '@aws-cdk/aws-route53';
import {ApiGateway} from "@aws-cdk/aws-route53-targets";
import lambda = require('@aws-cdk/aws-lambda');

interface ApigatewayStackProps extends cdk.StackProps {
}

export class ApigatewayStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: ApigatewayStackProps) {
        super(scope, id, props);
        const lambdaPath = path.join(process.cwd(), 'lambdaFunctions/test-handler');
        const domainName = 'zynebula.com';

        const fn = new lambda.Function(this, 'MyFunction', {
            functionName: "TestFunction",
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(lambdaPath),
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

        api.addDomainName('api-gateway-domain', {
            domainName: 'api.zynebula.com',
            endpointType: EndpointType.EDGE,
            certificate: certificate,
            securityPolicy: SecurityPolicy.TLS_1_2
        });

        testApi.addMethod('GET', new LambdaIntegration(fn), {
            authorizationType: AuthorizationType.IAM
        });

        const aRecord = new ARecord( this, "domain_alias_record", {
            recordName:  'api.zynebula.com',
            zone: hostedZone,
            target: RecordTarget.fromAlias(new ApiGateway(api))
        });
    }
}
