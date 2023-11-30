import { ErrMsg, basicHeaders } from '../constants';
import { Res } from '../types';

export const buildResponse = (statusCode: number, body: any): Res => ({
  statusCode,
  headers: basicHeaders,
  body: JSON.stringify(body),
});

export const validateBody = (body: string): boolean => {
  const newProduct = JSON.parse(body);
  const { title, description, price, count } = newProduct;

  return (
    typeof title === 'string' &&
    title.length > 0 &&
    typeof description === 'string' &&
    typeof price === 'number' &&
    typeof count === 'number'
  );
};

export const getSaveErrorMsg = (e: unknown): string => {
  if (e instanceof Error) {
    return e.message;
  }

  return ErrMsg.NOT_INSTANCE_OF_ERROR;
};
