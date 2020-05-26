#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
// import { CdkLambdaDemoStack } from '../lib/cdk_lambda_demo-stack';
import {IstackProps} from '../lib/IstackProps';
import {LineLambdaStack} from '../lib/stacks/lineHandleStack';
const stackProps: IstackProps = {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
};
const prefix = 'hackthon';
const app = new cdk.App();
// new CdkLambdaDemoStack(app, 'CdkLambdaDemoStack');
new LineLambdaStack(app, `${prefix}LineTransfer`, stackProps );