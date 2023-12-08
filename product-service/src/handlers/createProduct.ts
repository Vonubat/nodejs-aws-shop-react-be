import { APIGatewayProxyHandler } from 'aws-lambda';
import { ErrMsg, HttpStatusCode } from '../constants';
import { buildResponse, getSaveErrorMsg, validateBody } from '../utils';
import { HttpMethod } from 'aws-cdk-lib/aws-events';
import { createProductService } from '../services/createProductService';
import { NewProduct } from '../db';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(`CreateProductLambda: ${JSON.stringify(event)}`);

  try {
    const body = event.body;

    if (!body) {
      return buildResponse(HttpStatusCode.BAD_REQUEST, { message: ErrMsg.MISSING_BODY });
    }

    if (!validateBody(body)) {
      return buildResponse(HttpStatusCode.BAD_REQUEST, { message: ErrMsg.BODY_INVALID });
    }

    const parsedBody = JSON.parse(body) as NewProduct;

    switch (event.httpMethod) {
      case HttpMethod.POST: {
        const product = await createProductService(parsedBody);

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
