#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import {DynamoStack} from "../lib/dynamo-stack";
import {ApigatewayStack} from "../lib/apigateway-stack";
import {CdkCiCdPipelineStack} from "../lib/cdk-ci-cd-pipeline-stack";
import {HostedZone} from "@aws-cdk/aws-route53";
import {CertificateStack} from "../lib/certificate-stack";

const domainName = 'zynebula.com';

const app = new cdk.App();


const certificateStack = new CertificateStack(app, 'CertificateStack', {
    env: { account: '567028380312', region: 'us-east-1' },
    domainName: domainName,
})

new InfrastructureStack(app, 'InfrastructureStack', {
    env: { account: '567028380312', region: 'us-east-1' }
});

new DynamoStack(app, 'DatabaseStack', {
    env: { account: '567028380312', region: 'us-east-1' }
});

const apiGatewayStack = new ApigatewayStack(app, 'ApigatewayStack', {
    env: { account: '567028380312', region: 'us-east-1' },
    hostedZone: certificateStack.hostedZone,
    certificate: certificateStack.certificate
});

const cdkCiCdPipelineStack =  new CdkCiCdPipelineStack(app, 'CdkCiCdPipelineStack', {
    env: { account: '567028380312', region: 'us-east-1' },
    domainName: domainName
})

apiGatewayStack.addDependency(certificateStack);
cdkCiCdPipelineStack.addDependency(certificateStack);
