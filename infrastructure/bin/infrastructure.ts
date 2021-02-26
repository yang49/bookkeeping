#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import {DynamoStack} from "../lib/dynamo-stack";
import {ApigatewayStack} from "../lib/apigateway-stack";
import {CdkCiCdPipelineStack} from "../lib/cdk-ci-cd-pipeline-stack";

import {CertificateStack} from "../lib/certificate-stack";
import {Environment} from "@aws-cdk/core/lib/environment";

const domainName = 'zynebula.com';

const app = new cdk.App();


const stages = ['test', 'prod'];

stages.forEach( (stage) => {
    if (stage === 'prod') {
        const prodEnv = { account: '567028380312', region: 'us-east-1' };
        createStacks(prodEnv, true);
    } else {
        const testEnv = { account: '567028380312', region: 'us-west-1' };
        createStacks(testEnv);
    }
})

function createStacks(env: Environment, isProd?: boolean) {
    const stackNamePrefix = isProd ? '' : 'Test';
    const certificateStack = new CertificateStack(app, `${stackNamePrefix}CertificateStack`, {
        env: env,
        domainName: domainName,
    })

    new InfrastructureStack(app, `${stackNamePrefix}InfrastructureStack`, {
        env: env
    });

    new DynamoStack(app, `${stackNamePrefix}DatabaseStack`, {
        env: env
    });

    const apiGatewayStack = new ApigatewayStack(app, `${stackNamePrefix}ApigatewayStack`, {
        env: env,
        hostedZone: certificateStack.hostedZone,
        certificate: certificateStack.certificate
    });

    const cdkCiCdPipelineStack =  new CdkCiCdPipelineStack(app, `${stackNamePrefix}CdkCiCdPipelineStack`, {
        env: env,
        domainName: domainName,
        certificate: certificateStack.certificate
    })

    apiGatewayStack.addDependency(certificateStack);
    cdkCiCdPipelineStack.addDependency(certificateStack);
}
