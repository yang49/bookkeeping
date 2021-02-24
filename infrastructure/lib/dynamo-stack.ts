import * as cdk from "@aws-cdk/core";
import {AttributeType, BillingMode, ProjectionType, Table} from '@aws-cdk/aws-dynamodb';

interface DynamoStackProps extends cdk.StackProps {

}

export class DynamoStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: DynamoStackProps) {
        super(scope, id, props);
        const userTable = new Table(this, 'UserTable', {
            tableName: 'UserTable',
            partitionKey: { name: 'userId', type: AttributeType.STRING},
            billingMode: BillingMode.PAY_PER_REQUEST,
        });
        userTable.addGlobalSecondaryIndex({
            indexName: 'phone',
            partitionKey: {name: 'phone', type: AttributeType.STRING},
            projectionType: ProjectionType.ALL
        });
        userTable.addGlobalSecondaryIndex({
            indexName: 'email',
            partitionKey: {name: 'email', type: AttributeType.STRING},
            projectionType: ProjectionType.ALL
        });

        const companyTable = new Table(this, 'CompanyTable', {
            tableName: 'CompanyTable',
            partitionKey: { name: 'companyId', type: AttributeType.STRING },
            billingMode: BillingMode.PAY_PER_REQUEST,
        })
        const personalIncomeTable = new Table(this, 'PersonalIncomeTable', {
            tableName: 'PersonalIncomeTable',
            partitionKey: {name: 'userId', type: AttributeType.STRING},
            sortKey: {name: 'Date', type: AttributeType.STRING},
            billingMode: BillingMode.PAY_PER_REQUEST,
        })

    }

}
