import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

import { ErrMsg, productsTableName, region, stocksTableName } from '../constants';
import { Product, ProductInStock, Stock } from '../db';
import { isProduct, isStock } from '../utils';

const client = new DynamoDBClient({ region });
const doc = DynamoDBDocumentClient.from(client);

export const getProductListService = (): Promise<ProductInStock[]> => {
  const productsPromise = doc.send(
    new ScanCommand({
      TableName: productsTableName,
    }),
  );

  const stocksPromise = doc.send(
    new ScanCommand({
      TableName: stocksTableName,
    }),
  );

  return Promise.all([productsPromise, stocksPromise]).then(([res1, res2]) => {
    if (!res1.Items || !res2.Items) {
      throw new Error(ErrMsg.DB_ERROR);
    }

    const products = (isProduct(res1.Items[0]) ? res1.Items : res2.Items) as Product[];
    const stocks = (isStock(res1.Items[0]) ? res1.Items : res2.Items) as Stock[];
    const stocksMap: {
      [index: string]: number;
    } = {};
    stocks.forEach((it) => (stocksMap[it.product_id] = it.count));

    const productsInStock: ProductInStock[] = products.map((it) => {
      return {
        ...it,
        count: stocksMap[it.id] || 0,
      };
    });

    return productsInStock;
  });
};
