import { APIGatewayProxyHandler } from 'aws-lambda';

import { HttpStatusCode } from '../constants';
import { buildResponse } from '../utils';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(`importFileParserLambda: ${JSON.stringify(event)}`);

  return buildResponse(HttpStatusCode.OK, []);
};
