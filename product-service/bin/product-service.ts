#!/usr/bin/env node
import 'source-map-support/register';
import { App, RemovalPolicy } from 'aws-cdk-lib';
import { LambdaIntegration, Cors, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Topic, Subscription, SubscriptionProtocol } from 'aws-cdk-lib/aws-sns';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { resolve } from 'path';
import 'dotenv/config';

import { ProductServiceStack } from '../lib/product-service-stack';
import { HttpMethod, batchSize, bigStockEmail, productsTableName, region, stocksTableName } from '../src/constants';

const app = new App();
const stack = new ProductServiceStack(app, 'ProductServiceStack', {
  env: { region },
});

const catalogItemsQueue = new Queue(stack, 'CatalogItemsQueue', {
  queueName: 'catalog-items-queue',
});
const importProductsTopic = new Topic(stack, 'ImportProductsTopic', {
  topicName: 'import-products-topic',
});

new Subscription(stack, 'BigStockSubscription', {
  endpoint: bigStockEmail,
  protocol: SubscriptionProtocol.EMAIL,
  topic: importProductsTopic,
});

const sharedLambdaProps: NodejsFunctionProps = {
  runtime: Runtime.NODEJS_18_X,
  environment: {
    PRODUCT_AWS_REGION: region,
    PRODUCTS_TABLE_NAME: productsTableName,
    STOCKS_TABLE_NAME: stocksTableName,
    IMPORT_PRODUCT_TOPIC_ARN: importProductsTopic.topicArn,
  },
};

const getProductList = new NodejsFunction(stack, 'GetProductListLambda', {
  ...sharedLambdaProps,
  functionName: 'getProductList',
  entry: resolve('src/handlers/getProductList.ts'),
});

const getProductsById = new NodejsFunction(stack, 'GetProductByIdLambda', {
  ...sharedLambdaProps,
  functionName: 'getProductById',
  entry: resolve('src/handlers/getProductById.ts'),
});

const createProduct = new NodejsFunction(stack, 'CreateProductLambda', {
  ...sharedLambdaProps,
  functionName: 'createProduct',
  entry: resolve('src/handlers/createProduct.ts'),
});

const catalogBatchProccess = new NodejsFunction(stack, 'CatalogBatchProccessLambda', {
  ...sharedLambdaProps,
  functionName: 'catalogBatchProccess',
  entry: resolve('src/handlers/catalogBatchProccess.ts'),
});

importProductsTopic.grantPublish(catalogBatchProccess);
catalogBatchProccess.addEventSource(new SqsEventSource(catalogItemsQueue, { batchSize }));

const api = new RestApi(stack, 'productApi', {
  restApiName: 'Product API',
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowHeaders: Cors.DEFAULT_HEADERS,
    allowMethods: Cors.ALL_METHODS,
  },
});

const products = api.root.addResource('products');
const product = products.addResource('{productId}');

const getProductListIntegration = new LambdaIntegration(getProductList);
const getProductsByIdIntegration = new LambdaIntegration(getProductsById);
const createProductIntegration = new LambdaIntegration(createProduct);

products.addMethod(HttpMethod.GET, getProductListIntegration);
products.addMethod(HttpMethod.POST, createProductIntegration);
product.addMethod(HttpMethod.GET, getProductsByIdIntegration);

const productsTable = new Table(stack, 'products', {
  tableName: productsTableName,
  partitionKey: { name: 'id', type: AttributeType.STRING },
  sortKey: { name: 'title', type: AttributeType.STRING },
  removalPolicy: RemovalPolicy.DESTROY,
  billingMode: BillingMode.PROVISIONED,
});

productsTable.grantReadData(getProductList);
productsTable.grantReadData(getProductsById);
productsTable.grantWriteData(createProduct);

const stocksTable = new Table(stack, 'stock', {
  tableName: stocksTableName,
  partitionKey: { name: 'product_id', type: AttributeType.STRING },
  sortKey: { name: 'count', type: AttributeType.NUMBER },
  removalPolicy: RemovalPolicy.DESTROY,
  billingMode: BillingMode.PROVISIONED,
});

stocksTable.grantReadData(getProductList);
stocksTable.grantReadData(getProductsById);
stocksTable.grantWriteData(createProduct);
