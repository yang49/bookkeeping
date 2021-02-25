import * as cdk from "@aws-cdk/core";

interface CognitoStackProps extends cdk.StackProps {
    certificateArn: string
}

export class CognitoStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: CognitoStackProps) {
        super(scope, id, props);
    }
}
