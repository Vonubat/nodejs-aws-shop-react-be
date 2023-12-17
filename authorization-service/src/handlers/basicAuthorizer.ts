import { APIGatewayTokenAuthorizerEvent, Context, Callback } from 'aws-lambda';

import { getSaveErrorMsg } from '../utils';
import { basicAuthorizerService } from '../services';

export const handler = async (event: APIGatewayTokenAuthorizerEvent, _: Context, callback: Callback): Promise<void> => {
  console.log(`basicAuthorizerLambda: ${JSON.stringify(event)}`);

  try {
    basicAuthorizerService(event, callback);
  } catch (e) {
    callback(new Error(getSaveErrorMsg(e)));
  }
};
