import * as cdk from '@aws-cdk/core';
import {Certificate, CertificateValidation, DnsValidatedCertificate} from '@aws-cdk/aws-certificatemanager';
import {HostedZone, IHostedZone} from "@aws-cdk/aws-route53";
import {Construct} from "@aws-cdk/core";

interface CertificateStackProps extends cdk.StackProps {
    readonly domainName: string,
    readonly isProd: boolean
}

export class CertificateStack extends cdk.Stack {
    public certificate: Certificate
    public hostedZone: IHostedZone

    constructor(scope: Construct, id: string, props: CertificateStackProps) {
        super(scope, id, props);

        this.hostedZone = HostedZone.fromLookup(this, 'hostedZone', {
            domainName: props.domainName
        });

        const certificateId = props ? 'test-certificate' : 'certificate'
        if (props.isProd) {
            this.certificate = new Certificate(this, 'certificate', {
                domainName: '*.' + props.domainName,
                subjectAlternativeNames: [props.domainName],
                validation: CertificateValidation.fromDns(this.hostedZone)
            });
        } else {
            this.certificate = new DnsValidatedCertificate(this, certificateId, {
                hostedZone: this.hostedZone,
                region: 'us-east-1',
                domainName: '*.' + props.domainName,
                subjectAlternativeNames: [props.domainName],
                validation: CertificateValidation.fromDns(this.hostedZone)
            });
        }
    }
}
