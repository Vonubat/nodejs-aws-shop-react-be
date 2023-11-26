import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { BatchWriteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import 'dotenv/config';

import { region, productsTableName, stocksTableName } from '../constants';
import { generateProductData, generateStockData, getSaveErrorMsg } from '../utils';

const seed = async (doc: DynamoDBDocumentClient, tableName: string, items: Record<string, string | number>[]) => {
  await doc.send(
    new BatchWriteCommand({
      RequestItems: {
        [tableName]: items.map((Item) => ({
          PutRequest: {
            Item,
          },
        })),
      },
    }),
  );
};

const client = new DynamoDBClient({ region });
const doc = DynamoDBDocumentClient.from(client);
const products = generateProductData();
const stocks = generateStockData(products);

seed(doc, productsTableName, products)
  .then((_val) => console.log(`\x1b[32m The ${productsTableName} table seeding is successful! \x1b[0m`))
  .catch((e) => console.error(getSaveErrorMsg(e)));
seed(doc, stocksTableName, stocks)
  .then((_val) => console.log(`\x1b[32m The ${stocksTableName} table seeding is successful! \x1b[0m`))
  .catch((e) => console.error(getSaveErrorMsg(e)));
