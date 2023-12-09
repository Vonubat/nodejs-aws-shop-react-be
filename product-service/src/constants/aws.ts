const { REGION, PRODUCTS_TABLE_NAME, STOCKS_TABLE_NAME, BIG_STOCK_EMAIL, BATCH_SIZE, IMPORT_PRODUCTS_TOPIC_ARN } =
  process.env;

export const region = REGION || 'eu-west-1';
export const productsTableName = PRODUCTS_TABLE_NAME || 'products';
export const stocksTableName = STOCKS_TABLE_NAME || 'stocks';
export const bigStockEmail = BIG_STOCK_EMAIL || 'vonubat@gmail.com';
export const batchSize = (BATCH_SIZE && parseInt(BATCH_SIZE)) || 5;
export const importProductsTopicArn =
  IMPORT_PRODUCTS_TOPIC_ARN || 'arn:aws:sns:eu-west-1:479708664089:import-products-topic';
