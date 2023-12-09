import { APIGatewayProxyHandler } from 'aws-lambda';
import { ErrMsg, HttpStatusCode } from '../constants';
import { buildResponse, getSaveErrorMsg, parseBody, validateBody } from '../utils';
import { HttpMethod } from 'aws-cdk-lib/aws-events';
import { createProductService } from '../services/createProductService';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(`CreateProductLambda: ${JSON.stringify(event)}`);

  try {
    const body = event.body;

    if (!body) {
      return buildResponse(HttpStatusCode.BAD_REQUEST, { message: ErrMsg.MISSING_BODY });
    }

    const parsedBody = parseBody(body);

    if (!validateBody(parsedBody)) {
      return buildResponse(HttpStatusCode.BAD_REQUEST, { message: ErrMsg.BODY_INVALID });
    }

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
