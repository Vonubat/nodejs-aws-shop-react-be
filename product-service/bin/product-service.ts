#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { resolve } from 'path';
import 'dotenv/config';

import { ProductServiceStack } from '../lib/product-service-stack';
import { HttpMethod, productsTableName, region, stocksTableName } from '../src/constants';

const app = new cdk.App();
const stack = new ProductServiceStack(app, 'ProductServiceStack', {
  env: { region },
});

const sharedLambdaProps: NodejsFunctionProps = {
  runtime: lambda.Runtime.NODEJS_18_X,
  environment: {
    PRODUCT_AWS_REGION: region,
    PRODUCTS_TABLE_NAME: productsTableName,
    STOCKS_TABLE_NAME: stocksTableName,
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

const api = new apiGateway.RestApi(stack, 'productApi', {
  restApiName: 'Product API',
  defaultCorsPreflightOptions: {
    allowOrigins: apiGateway.Cors.ALL_ORIGINS,
    allowHeaders: apiGateway.Cors.DEFAULT_HEADERS,
    allowMethods: apiGateway.Cors.ALL_METHODS,
  },
});

const products = api.root.addResource('products');
const product = products.addResource('{productId}');

const getProductListIntegration = new apiGateway.LambdaIntegration(getProductList);
const getProductsByIdIntegration = new apiGateway.LambdaIntegration(getProductsById);
const createProductIntegration = new apiGateway.LambdaIntegration(createProduct);

products.addMethod(HttpMethod.GET, getProductListIntegration);
products.addMethod(HttpMethod.POST, createProductIntegration);
product.addMethod(HttpMethod.GET, getProductsByIdIntegration);

const productsTable = new Table(stack, 'products', {
  tableName: productsTableName,
  partitionKey: { name: 'id', type: AttributeType.STRING },
  sortKey: { name: 'title', type: AttributeType.STRING },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  billingMode: BillingMode.PROVISIONED,
});

productsTable.grantReadData(getProductList);
productsTable.grantReadData(getProductsById);
productsTable.grantWriteData(createProduct);

const stocksTable = new Table(stack, 'stock', {
  tableName: stocksTableName,
  partitionKey: { name: 'product_id', type: AttributeType.STRING },
  sortKey: { name: 'count', type: AttributeType.NUMBER },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  billingMode: BillingMode.PROVISIONED,
});

stocksTable.grantReadData(getProductList);
stocksTable.grantReadData(getProductsById);
stocksTable.grantWriteData(createProduct);
