#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { resolve } from 'path';
import 'dotenv/config';

import { ProductServiceStack } from '../lib/product-service-stack';
import { HttpMethod, region } from '../src/constants';

const app = new cdk.App();
const stack = new ProductServiceStack(app, 'ProductServiceStack', {
  env: { region },
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

const sharedLambdaProps: NodejsFunctionProps = {
  runtime: lambda.Runtime.NODEJS_18_X,
  environment: {
    PRODUCT_AWS_REGION: region,
  },
};

const getProductList = new NodejsFunction(stack, 'GetProductListLambda', {
  ...sharedLambdaProps,
  functionName: 'getProductList',
  entry: resolve('src/handlers/getProductList.ts'),
});

const api = new apiGateway.RestApi(stack, 'productApi', {
  restApiName: 'Product API',
  defaultCorsPreflightOptions: {
    allowOrigins: apiGateway.Cors.ALL_ORIGINS,
    allowHeaders: apiGateway.Cors.DEFAULT_HEADERS,
    allowMethods: apiGateway.Cors.ALL_METHODS,
  },
});

const products = api.root.addResource('products');
// const product = products.addResource('{productId}');
const productsIntegration = new apiGateway.LambdaIntegration(getProductList);
// const productIntegration = new apiGateway.LambdaIntegration(getProductList);

products.addMethod(HttpMethod.GET, productsIntegration);
