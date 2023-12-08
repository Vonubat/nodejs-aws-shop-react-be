import { APIGatewayProxyHandler } from 'aws-lambda';
import { ErrMsg, HttpMethod, HttpStatusCode } from '../constants';
import { buildResponse, getSaveErrorMsg } from '../utils';
import { getProductListService } from '../services';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(`GetProductListLambda: ${JSON.stringify(event)}`);

  try {
    switch (event.httpMethod) {
      case HttpMethod.GET: {
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
