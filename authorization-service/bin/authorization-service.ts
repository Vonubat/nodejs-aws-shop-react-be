#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { AuthorizationServiceStack } from '../lib/authorization-service-stack';
import { resolve } from 'path';
import 'dotenv/config';

import { credentials, region } from '../src/constants';

const app = new App();
const stack = new AuthorizationServiceStack(app, 'AuthorizationServiceStack', {
  env: { region },
});

const sharedLambdaProps: NodejsFunctionProps = {
  runtime: Runtime.NODEJS_18_X,
  environment: {
    PRODUCT_AWS_REGION: region,
    CREDENTIALS: credentials,
  },
};

const basicAuthorizer = new NodejsFunction(stack, 'BasicAuthorizerLambda', {
  ...sharedLambdaProps,
  functionName: 'basicAuthorizer',
  entry: resolve('src/handlers/basicAuthorizer.ts'),
});
