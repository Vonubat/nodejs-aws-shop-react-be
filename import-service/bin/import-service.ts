#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { RestApi, Cors, LambdaIntegration, ResponseType, TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { Runtime, Function } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ImportServiceStack } from '../lib/import-service-stack';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { resolve } from 'path';
import 'dotenv/config';

import {
  HttpMethod,
  HttpStatusCode,
  authorizerHeaders,
  basicAuthorizerArn,
  bucketName,
  catalogItemsQueueArn,
  prefix,
  region,
} from '../src/constants';

const app = new App();
const stack = new ImportServiceStack(app, 'ImportServiceStack', {
  env: { region },
});

const bucket = Bucket.fromBucketName(stack, 'ImportBucket', bucketName);
const queue = Queue.fromQueueArn(stack, 'CatalogItemsQueue', catalogItemsQueueArn);
const authorizer = Function.fromFunctionArn(stack, 'BasicAuthorizerLambda', basicAuthorizerArn);

const sharedLambdaProps: NodejsFunctionProps = {
  runtime: Runtime.NODEJS_18_X,
  environment: {
    PRODUCT_AWS_REGION: region,
    BUCKET_NAME: bucketName,
    IMPORT_SQS_URL: queue.queueUrl,
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
queue.grantSendMessages(importFileParser);

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

api.addGatewayResponse('ImportProductsFileUnauthorized', {
  type: ResponseType.UNAUTHORIZED,
  statusCode: `${HttpStatusCode.UNAUTHORIZED}`,
  responseHeaders: authorizerHeaders,
});

api.addGatewayResponse('ImportProductsFileForbidden', {
  type: ResponseType.ACCESS_DENIED,
  statusCode: `${HttpStatusCode.FORBIDDEN}`,
  responseHeaders: authorizerHeaders,
});

const authRole = new Role(stack, 'ImportProductsFileAuthorizerRole', {
  assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
});

authRole.addToPolicy(
  new PolicyStatement({
    actions: ['lambda:InvokeFunction'],
    resources: [authorizer.functionArn],
  }),
);

const importProductsFileAuthorizer = new TokenAuthorizer(stack, 'ImportProductsFileAuthorizer', {
  handler: authorizer,
  assumeRole: authRole,
});

importResource.addMethod(HttpMethod.GET, importProductsFileIntegration, {
  authorizer: importProductsFileAuthorizer,
});

bucket.grantReadWrite(importProductsFile);
bucket.grantDelete(importFileParser);

bucket.addEventNotification(EventType.OBJECT_CREATED, new LambdaDestination(importFileParser), {
  prefix,
});
