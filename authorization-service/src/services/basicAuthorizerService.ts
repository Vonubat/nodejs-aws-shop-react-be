import { APIGatewayTokenAuthorizerEvent, Callback, AuthResponse } from 'aws-lambda';

import { ErrMsg, credentials } from '../constants';
import { getSaveErrorMsg } from '../utils';

import 'dotenv/config';

export const basicAuthorizerService = (e: APIGatewayTokenAuthorizerEvent, cb: Callback) => {
  try {
    const { authorizationToken } = e;

    if (!authorizationToken) {
      cb(new Error(ErrMsg.TOKEN_INVALID));
    }

    const token = authorizationToken.split(' ')[1];
    const parsedToken = Buffer.from(token, 'base64').toString('utf-8');
    const effect = parsedToken !== credentials ? 'Deny' : 'Allow';
    const policy = generatePolicy('user', effect, e.methodArn);

    cb(null, policy);
  } catch (err) {
    cb(new Error(`${ErrMsg.UNAUTHORIZED}: ${getSaveErrorMsg(err)}`));
  }
};

const generatePolicy = (principalId: string, effect: string, resource: string): AuthResponse => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};
