import { APIGatewayProxyEvent } from 'aws-lambda';
import { basicHeaders, ErrMsg } from '../constants';
import { buildResponse, getSaveErrorMsg } from '../utils';
import { Res } from '../types';

export const handler = async (event: APIGatewayProxyEvent): Promise<Res> => {
  try {
    const id = event.pathParameters?.productId;

    if (!id) {
      return buildResponse(422, { message: ErrMsg.MISSING_ID }, basicHeaders);
    }

    switch (event.httpMethod) {
      case 'GET': {
        // const product = getOne({ id });
        const product = { test: 42 };

        if (!product) {
          return buildResponse(404, { message: ErrMsg.DOES_NOT_EXIST }, basicHeaders);
        }

        return buildResponse(200, { product: product }, basicHeaders);
      }
      default: {
        return buildResponse(405, { message: ErrMsg.INVALID_HTTP_METHOD }, basicHeaders);
      }
    }
  } catch (e) {
    return buildResponse(500, { message: getSaveErrorMsg(e) }, basicHeaders);
  }
};
