import { APIGatewayProxyEvent } from 'aws-lambda';
import { ErrMsg, HttpStatusCode } from '../constants';
import { buildResponse, getSaveErrorMsg } from '../utils';
import { Res } from '../types';
import { getProductListService } from '../services';

export const handler = async (event: APIGatewayProxyEvent): Promise<Res> => {
  console.log(`Lambda getProductList: ${JSON.stringify(event)}`);

  try {
    switch (event.httpMethod) {
      case 'GET': {
        const products = await getProductListService();
        return buildResponse(HttpStatusCode.OK, products);
      }
      default: {
        return buildResponse(HttpStatusCode.METHOD_NOT_ALLOWED, { message: ErrMsg.INVALID_HTTP_METHOD });
      }
    }
  } catch (e) {
    return buildResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, { message: getSaveErrorMsg(e) });
  }
};
