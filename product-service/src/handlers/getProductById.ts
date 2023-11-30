import { APIGatewayProxyEvent } from 'aws-lambda';
import { ErrMsg, HttpMethod, HttpStatusCode } from '../constants';
import { buildResponse, getSaveErrorMsg } from '../utils';
import { Res } from '../types';
import { getProductByIdService } from '../services';

export const handler = async (event: APIGatewayProxyEvent): Promise<Res> => {
  console.log(`GetProductByIdLambda: ${JSON.stringify(event)}`);

  try {
    const id = event.pathParameters?.productId;

    if (!id) {
      return buildResponse(HttpStatusCode.BAD_REQUEST, { message: ErrMsg.MISSING_ID });
    }

    switch (event.httpMethod) {
      case HttpMethod.GET: {
        const product = await getProductByIdService(id);

        if (!product) {
          return buildResponse(HttpStatusCode.NOT_FOUND, { message: ErrMsg.DOES_NOT_EXIST });
        }

        return buildResponse(HttpStatusCode.OK, { product: product });
      }
      default: {
        return buildResponse(HttpStatusCode.METHOD_NOT_ALLOWED, { message: ErrMsg.INVALID_HTTP_METHOD });
      }
    }
  } catch (e) {
    return buildResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, { message: getSaveErrorMsg(e) });
  }
};
