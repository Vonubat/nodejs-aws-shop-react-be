const { REGION, BUCKET_NAME, PREFIX_FILTER, CATALOG_ITEMS_QUEUE_ARN, QUEUE_URL, BASIC_AUTHORIZER_ARN } = process.env;

export const region = REGION || 'eu-west-1';
export const bucketName = BUCKET_NAME || 'nodejs-aws-import-service';
export const prefix = PREFIX_FILTER || 'uploaded/';
export const catalogItemsQueueArn = CATALOG_ITEMS_QUEUE_ARN || 'arn:aws:sqs:eu-west-1:479708664089:catalog-items-queue';
export const queueUrl = QUEUE_URL || 'https://sqs.eu-west-1.amazonaws.com/479708664089/catalog-items-queue';
export const basicAuthorizerArn =
  BASIC_AUTHORIZER_ARN || 'arn:aws:lambda:eu-west-1:479708664089:function:basicAuthorizer';
