/**
 * This file just specify the interface for construct
 */

 import cdk = require('@aws-cdk/core'); // the basic libray to construct stack
 import {LineLambdaConstruct} from '../contructs/lineHandleConstruct';
 export class LineLambdaStack extends cdk.Stack {
     constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) { // basic interface
       super(scope, id, props);
       // actuall contruct is following
        new LineLambdaConstruct(this, 'LineLamgaConstruct');
     }
 }