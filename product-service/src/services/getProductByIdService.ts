import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

import { ErrMsg, productsTableName, region, stocksTableName } from '../constants';
import { Product, ProductInStock, Stock } from '../db';
import { isProduct, isStock } from '../utils';

const client = new DynamoDBClient({ region });
const doc = DynamoDBDocumentClient.from(client);

export const getProductByIdService = (id: string): Promise<ProductInStock | null> => {
  const productPromise = doc.send(
    new QueryCommand({
      TableName: productsTableName,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: { ':id': id },
    }),
  );

  const stockPromise = doc.send(
    new QueryCommand({
      TableName: stocksTableName,
      KeyConditionExpression: 'product_id = :product_id',
      ExpressionAttributeValues: { ':product_id': id },
    }),
  );

  return Promise.all([productPromise, stockPromise])
    .then(([res1, res2]) => {
      if (!res1.Items || !res1.Items.length || !res2.Items || !res2.Items.length) {
        return null;
      }

      const product = (isProduct(res1.Items[0]) ? res1.Items[0] : res2.Items[0]) as Product;
      const stock = (isStock(res1.Items[0]) ? res1.Items[0] : res2.Items[0]) as Stock;

      const productInStock: ProductInStock = {
        ...product,
        count: stock.count,
      };

      return productInStock;
    })
    .catch((_e) => {
      throw new Error(ErrMsg.DB_ERROR);
    });
};
