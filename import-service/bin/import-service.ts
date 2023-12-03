#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { RestApi, Cors, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ImportServiceStack } from '../lib/import-service-stack';
import { resolve } from 'path';
import 'dotenv/config';

import { HttpMethod, bucketName, prefix, region } from '../src/constants';

const app = new App();
const stack = new ImportServiceStack(app, 'ImportServiceStack', {
  env: { region },
});

const bucket = Bucket.fromBucketName(stack, 'ImportBucket', bucketName);

const sharedLambdaProps: NodejsFunctionProps = {
  runtime: Runtime.NODEJS_18_X,
  environment: {
    PRODUCT_AWS_REGION: region,
    BUCKET_NAME: bucketName,
  },
};

const importProductsFile = new NodejsFunction(stack, 'importProductsFileLambda', {
  ...sharedLambdaProps,
  functionName: 'importProductsFile',
  entry: resolve('src/handlers/importProductsFile.ts'),
});

const importFileParser = new NodejsFunction(stack, 'importFileParserLambda', {
  ...sharedLambdaProps,
  functionName: 'importFileParser',
  entry: resolve('src/handlers/importFileParser.ts'),
});

const api = new RestApi(stack, 'importApi', {
  restApiName: 'Import API',
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowHeaders: Cors.DEFAULT_HEADERS,
    allowMethods: Cors.ALL_METHODS,
  },
});

const importResource = api.root.addResource('import');
const importProductsFileIntegration = new LambdaIntegration(importProductsFile);

importResource.addMethod(HttpMethod.GET, importProductsFileIntegration);

bucket.grantReadWrite(importProductsFile);
bucket.grantDelete(importFileParser);

bucket.addEventNotification(EventType.OBJECT_CREATED, new LambdaDestination(importFileParser), {
  prefix,
});
