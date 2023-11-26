import { APIGatewayProxyEvent } from 'aws-lambda';
import { ErrMsg, HttpStatusCode } from '../constants';
import { buildResponse, getSaveErrorMsg } from '../utils';
import { db } from '../db';
import { Res } from '../types';

export const handler = async (event: APIGatewayProxyEvent): Promise<Res> => {
  try {
    switch (event.httpMethod) {
      case 'GET': {
        return buildResponse(HttpStatusCode.OK, db);
      }
      default: {
        return buildResponse(HttpStatusCode.METHOD_NOT_ALLOWED, { message: ErrMsg.INVALID_HTTP_METHOD });
      }
    }
  } catch (e) {
    return buildResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, { message: getSaveErrorMsg(e) });
  }
};
