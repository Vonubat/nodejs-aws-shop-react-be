import { randomUUID } from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

import { ErrMsg, productsTableName, region, stocksTableName } from '../constants';
import { NewProduct, ProductInStock } from '../db';

const client = new DynamoDBClient({ region });
const doc = DynamoDBDocumentClient.from(client);

export const createProductService = (data: NewProduct): Promise<ProductInStock | void> => {
  const id = randomUUID();
  const newProductPromise = doc.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: productsTableName,
            Item: {
              ...data,
              id,
            },
          },
        },
        {
          Put: {
            TableName: stocksTableName,
            Item: {
              product_id: id,
              count: data.count,
            },
          },
        },
      ],
    }),
  );

  return newProductPromise
    .then((res) => {
      return { id, ...data };
    })
    .catch((_e) => {
      throw new Error(ErrMsg.DB_ERROR);
    });
};
