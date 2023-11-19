import { APIGatewayProxyEvent } from 'aws-lambda';
import { ErrMsg, HttpMethod, basicHeaders } from '../src/constants';
import { handler as getProductList } from '../src/handlers/getProductList';
import { handler as getProductById } from '../src/handlers/getProductById';

import { default as db } from '../src/db/mockDb.json';

const reqGetProductListOk = {
  httpMethod: HttpMethod.GET,
};

const reqGetProductListIvalidMethod = {
  httpMethod: HttpMethod.POST,
};

const reqGetProductByIdOk = {
  httpMethod: HttpMethod.GET,
  pathParameters: {
    productId: '1',
  },
};

const reqGetProductByMissingId = {
  httpMethod: HttpMethod.GET,
  pathParameters: {},
};

const reqGetProductByDoesNotExist = {
  httpMethod: HttpMethod.GET,
  pathParameters: {
    productId: '100',
  },
};

test('should success request to api getProductList', async () => {
  const expected = {
    statusCode: 200,
    headers: basicHeaders,
    body: JSON.stringify(db),
  };

  const response = await getProductList(reqGetProductListOk as APIGatewayProxyEvent);
  expect(response).toEqual(expected);
});

test('should fail request to api getProductList', async () => {
  const expected = {
    statusCode: 405,
    headers: basicHeaders,
    body: JSON.stringify({ message: ErrMsg.INVALID_HTTP_METHOD }),
  };

  const response = await getProductList(reqGetProductListIvalidMethod as APIGatewayProxyEvent);
  expect(response).toEqual(expected);
});

test('should success request to api getProductById', async () => {
  const expected = {
    statusCode: 200,
    headers: basicHeaders,
    body: JSON.stringify({ product: db[0] }),
  };

  const response = await getProductById(reqGetProductByIdOk as unknown as APIGatewayProxyEvent);
  expect(response).toEqual(expected);
});

test('should fail request to api getProductById (MISSING_ID)', async () => {
  const expected = {
    statusCode: 422,
    headers: basicHeaders,
    body: JSON.stringify({ message: ErrMsg.MISSING_ID }),
  };

  const response = await getProductById(reqGetProductByMissingId as unknown as APIGatewayProxyEvent);
  expect(response).toEqual(expected);
});

test('should fail request to api getProductById (DOES_NOT_EXIST)', async () => {
  const expected = {
    statusCode: 404,
    headers: basicHeaders,
    body: JSON.stringify({ message: ErrMsg.DOES_NOT_EXIST }),
  };

  const response = await getProductById(reqGetProductByDoesNotExist as unknown as APIGatewayProxyEvent);
  expect(response).toEqual(expected);
});
