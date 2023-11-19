import { APIGatewayProxyEvent } from 'aws-lambda';
import { Res, basicHeaders, ErrMsg } from '../constants';
import { buildResponse, getOne, getSaveErrorMsg } from '../utils';

export const handler = async (event: APIGatewayProxyEvent): Promise<Res> => {
  try {
    const id = event.pathParameters?.productId;

    if (!id) {
      return buildResponse(422, { message: ErrMsg.MISSING_ID }, basicHeaders);
    }

    switch (event.httpMethod) {
      case 'GET': {
        const product = getOne({ id });
        return buildResponse(product ? 200 : 404, { product: product || ErrMsg.DOES_NOT_EXIST }, basicHeaders);
      }
      default: {
        return buildResponse(405, { message: ErrMsg.INVALID_HTTP_METHOD }, basicHeaders);
      }
    }
  } catch (e) {
    return buildResponse(500, { message: getSaveErrorMsg(e) }, basicHeaders);
  }
};
