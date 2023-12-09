import { APIGatewayProxyResult } from 'aws-lambda';
import { ErrMsg, basicHeaders } from '../constants';
import { NewProduct } from '../db';

export const buildResponse = (statusCode: number, body: any): APIGatewayProxyResult => ({
  statusCode,
  headers: basicHeaders,
  body: JSON.stringify(body),
});

export const parseBody = (body: string): Record<string, any> => {
  const newProduct = JSON.parse(body);
  const { title, description, price, count } = newProduct;

  return { title, description, price: parseInt(price), count: parseInt(count) };
};

export const validateBody = (body: Record<string, any>): body is NewProduct => {
  const { title, description, price, count } = body;

  return (
    typeof title === 'string' &&
    title.length > 0 &&
    typeof description === 'string' &&
    typeof price === 'number' &&
    price > 0 &&
    typeof count === 'number' &&
    count > 0
  );
};

export const getSaveErrorMsg = (e: unknown): string => {
  if (e instanceof Error) {
    return e.message;
  }

  return ErrMsg.NOT_INSTANCE_OF_ERROR;
};
