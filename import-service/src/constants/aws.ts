const { REGION, BUCKET_NAME, PREFIX_FILTER, CATALOG_ITEMS_QUEUE_ARN, QUEUE_URL } = process.env;

export const region = REGION || 'eu-west-1';
export const bucketName = BUCKET_NAME || 'nodejs-aws-import-service';
export const prefix = PREFIX_FILTER || 'uploaded/';
export const catalogItemsQueueArn = CATALOG_ITEMS_QUEUE_ARN || 'arn:aws:sqs:eu-west-1:479708664089:catalog-items-queue';
export const queueUrl =
  CATALOG_ITEMS_QUEUE_ARN || 'https://sqs.eu-west-1.amazonaws.com/479708664089/catalog-items-queue';
