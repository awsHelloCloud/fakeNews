/**
 * This file specify exact contruct process
 */
import cdk = require('@aws-cdk/core');
// need to npm i @aws-cdk/aws-lambda  @aws-cdk/aws-apigateway -D
import lambda = require('@aws-cdk/aws-lambda');
import apigatewway = require('@aws-cdk/aws-apigateway');
import {FollowMode} from '@aws-cdk/assets';
import path = require('path');

export class LineLambdaConstruct extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string) { 
        super(scope, id); // initial

        /**
         * Declare lambdaFunction binding
         */
        const lambdaFunc = new lambda.Function(this, 'lineTransferFunc', {
            runtime: lambda.Runtime.NODEJS_10_X,
            handler: 'index.handler', //specific with filename and function name
            code: lambda.Code.fromAsset( path.join(__dirname, '../../../fakeNewsLineBot'),{
                follow: FollowMode.EXTERNAL
            }),
            timeout: cdk.Duration.seconds(30) // timeout setting
        });

        /**
         * ApiGateway setup , scope, name(id)
         */
        const api = new apigatewway.RestApi(this, 'line_api_gateway', {
            restApiName: '/line_transfer'
        });
           
        const lineLambdaIntegeration = new apigatewway.LambdaIntegration(
            lambdaFunc
        );

        api.root.resourceForPath('/line_transfer').addMethod('POST', lineLambdaIntegeration);
    }
}