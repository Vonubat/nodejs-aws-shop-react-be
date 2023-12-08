import { APIGatewayProxyHandler } from 'aws-lambda';

import { ErrMsg, HttpMethod, HttpStatusCode } from '../constants';
import { buildResponse, getSaveErrorMsg } from '../utils';
import { importProductsFileService } from '../services';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(`importProductsFileLambda: ${JSON.stringify(event)}`);

  try {
    const fileName = event.queryStringParameters?.name;

    if (!fileName) {
      return buildResponse(HttpStatusCode.BAD_REQUEST, { message: ErrMsg.MISSING_FILE_NAME });
    }

    switch (event.httpMethod) {
      case HttpMethod.GET: {
        const signedUrl = await importProductsFileService(fileName);

        return buildResponse(HttpStatusCode.OK, signedUrl);
      }
      default: {
        return buildResponse(HttpStatusCode.METHOD_NOT_ALLOWED, { message: ErrMsg.INVALID_HTTP_METHOD });
      }
    }
  } catch (e) {
    return buildResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, { message: getSaveErrorMsg(e) });
  }
};
