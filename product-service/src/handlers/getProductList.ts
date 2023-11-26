import { APIGatewayProxyEvent } from 'aws-lambda';
import { basicHeaders, ErrMsg } from '../constants';
import { buildResponse, getSaveErrorMsg } from '../utils';
import { db } from '../db';
import { Res } from '../types';

export const handler = async (event: APIGatewayProxyEvent): Promise<Res> => {
  try {
    switch (event.httpMethod) {
      case 'GET': {
        return buildResponse(200, db, basicHeaders);
      }
      default: {
        return buildResponse(405, { message: ErrMsg.INVALID_HTTP_METHOD }, basicHeaders);
      }
    }
  } catch (e) {
    return buildResponse(500, { message: getSaveErrorMsg(e) }, basicHeaders);
  }
};
