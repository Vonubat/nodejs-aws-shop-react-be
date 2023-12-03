import { APIGatewayProxyResult, S3Event } from 'aws-lambda';

import { HttpStatusCode } from '../constants';
import { buildResponse, getSaveErrorMsg } from '../utils';
import { importFileParserService } from '../services';

export const handler = async (event: S3Event): Promise<APIGatewayProxyResult> => {
  console.log(`importFileParserLambda: ${JSON.stringify(event)}`);

  try {
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const message = await importFileParserService(key);

    return buildResponse(HttpStatusCode.OK, { message });
  } catch (e) {
    return buildResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, { message: getSaveErrorMsg(e) });
  }
};
