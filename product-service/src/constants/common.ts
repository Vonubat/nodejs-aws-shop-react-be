export const basicHeaders = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

export enum HttpMethod {
  /** HTTP ANY */
  ANY = 'ANY',
  /** HTTP DELETE */
  DELETE = 'DELETE',
  /** HTTP GET */
  GET = 'GET',
  /** HTTP HEAD */
  HEAD = 'HEAD',
  /** HTTP OPTIONS */
  OPTIONS = 'OPTIONS',
  /** HTTP PATCH */
  PATCH = 'PATCH',
  /** HTTP POST */
  POST = 'POST',
  /** HTTP PUT */
  PUT = 'PUT',
}

export type Res = {
  statusCode: number;
  headers: Record<string, any>;
  body: string;
};

export enum ErrMsg {
  INVALID_HTTP_METHOD = 'Invalid HTTP method',
  NOT_INSTANCE_OF_ERROR = 'Failed to do something exceptional',
  MISSING_ID = 'Missing path parameter: id',
  DOES_NOT_EXIST = `Product with such id doesn't exist`,
}

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
};
