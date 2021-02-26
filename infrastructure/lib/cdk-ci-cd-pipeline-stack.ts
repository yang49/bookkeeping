import * as cdk from '@aws-cdk/core';
import {RemovalPolicy} from '@aws-cdk/core';
import {AddressRecordTarget, ARecord, HostedZone} from "@aws-cdk/aws-route53";
import {DnsValidatedCertificate} from '@aws-cdk/aws-certificatemanager';
import {Artifact, Pipeline} from '@aws-cdk/aws-codepipeline';
import {Bucket} from "@aws-cdk/aws-s3";
import {CloudFrontWebDistribution, SecurityPolicyProtocol, SSLMethod} from "@aws-cdk/aws-cloudfront";
import {CloudFrontTarget} from "@aws-cdk/aws-route53-targets";
import {CodeBuildAction, CodeCommitSourceAction, CodeCommitTrigger} from "@aws-cdk/aws-codepipeline-actions";
import {ManagedPolicy, Role, ServicePrincipal} from "@aws-cdk/aws-iam";
import {BuildSpec, Project, Source} from "@aws-cdk/aws-codebuild";
import {Repository} from "@aws-cdk/aws-codecommit";

interface CdkCiCdPipelineStackProps extends cdk.StackProps {
    readonly domainName: string
}

export class CdkCiCdPipelineStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: CdkCiCdPipelineStackProps) {
        super(scope, id, props);

        const hostedZone = HostedZone.fromLookup(this, props.domainName, {
            domainName: props.domainName,
            privateZone: false,
        });

        const frontendCertificate = new DnsValidatedCertificate(this, 'WebAppCertificate', {
            domainName: props.domainName,
            hostedZone,
            region: 'us-east-1'
        });  // certificate region MUST be us-east-1

        const siteBucket = new Bucket(this, 'SiteBucket', {
            bucketName: props.domainName,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'error.html',
            publicReadAccess: true,
            removalPolicy: RemovalPolicy.DESTROY,
            blockPublicAccess: {
                restrictPublicBuckets: false,
                blockPublicAcls: false,
                ignorePublicAcls: false,
                blockPublicPolicy: false
            }
        });

        const distribution = new CloudFrontWebDistribution(this, 'WebAppDistribution', {
            aliasConfiguration: {
                acmCertRef: frontendCertificate.certificateArn,
                names: [props.domainName],
                sslMethod: SSLMethod.SNI,
                securityPolicy: SecurityPolicyProtocol.TLS_V1_1_2016,
            },
            originConfigs: [{
                s3OriginSource: {
                    s3BucketSource: siteBucket
                },
                behaviors: [{ isDefaultBehavior: true }],
            }],
            errorConfigurations: [{
                errorCode: 404,
                errorCachingMinTtl: 300,
                responseCode: 200,
                responsePagePath: '/index.html'
            },{
                errorCode: 403,
                errorCachingMinTtl: 300,
                responseCode: 200,
                responsePagePath: '/index.html'
            }]
        });

        new ARecord(this, 'ARecord', {
            recordName: props.domainName,
            zone: hostedZone,
            target: AddressRecordTarget.fromAlias(new CloudFrontTarget(distribution)),
        });

        const pipeline = new Pipeline(this, 'FrontendPipeline', {
            pipelineName: 'deploy-angular-application',
        });

        // add Stages
        const sourceStage = pipeline.addStage({
            stageName: 'Source'
        });

        const buildStage = pipeline.addStage({
            stageName: 'Build',
            placement: {
                justAfter: sourceStage
            }
        });

        const sourceOutput = new Artifact();

        const repository = Repository.fromRepositoryName(this, 'ProjectRepo', 'bookkeeping');
        const sourceAction = new CodeCommitSourceAction({
            actionName: 'CodeCommit',
            repository,
            branch: 'prod',
            output: sourceOutput,
            trigger: CodeCommitTrigger.POLL
        });

        sourceStage.addAction(sourceAction);

        const role = new Role(this, 'CodeBuildRole', {
            assumedBy: new ServicePrincipal('codebuild.amazonaws.com'),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
                ManagedPolicy.fromAwsManagedPolicyName('CloudFrontFullAccess'),
                ManagedPolicy.fromAwsManagedPolicyName('AWSCodeCommitFullAccess')
            ]
        });

        const codeBuild = new Project(this, 'CodeBuildProject', {
            role,
            source: Source.codeCommit({ repository }),
            buildSpec: BuildSpec.fromObject({
                "version": 0.2,
                "phases": {
                    "install": {
                        "runtime-versions": {
                            "nodejs": 12
                        },
                        "commands": [
                            "echo $(ls)",
                            "echo installing dependencies",
                            "cd frontend",
                            "npm install",
                            "echo installing aws cli",
                            "pip install awscli --upgrade --user",
                            "echo check version",
                            "aws --version",
                            "echo installing angular cli",
                            "npm i -g @angular/cli@11.1.4"
                        ]
                    },
                    "build": {
                        "commands": [
                            "echo $(ls)",
                            "echo Build started on `date`",
                            "echo Building frontend",
                            "ng build --prod"
                        ],
                        "artifacts": {
                            "files": [
                                "**/*"
                            ],
                            "base-directory": "dist/frontend",
                            "discard-paths": "yes"
                        }
                    },
                    "post_build": {
                        "commands": [
                            "echo BUILD COMPLETE running sync with s3",
                            "aws s3 rm s3://zynebula.com/ --recursive",
                            "aws s3 cp ./dist/frontend s3://zynebula.com/ --recursive --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers",
                            "aws cloudfront create-invalidation --distribution-id E3VFVWWPF20DBW --paths \"/*\""
                        ]
                    }
                }
            })
        });

        const buildAction = new CodeBuildAction({
            actionName: 'Build',
            input: sourceOutput,
            project: codeBuild
        });

        buildStage.addAction(buildAction);
    }
}
