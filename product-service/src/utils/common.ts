import { Res } from '../constants';
import { ErrMsg } from '../constants';

export const buildResponse = (statusCode: number, body: Record<string, any>, headers: Record<string, any>): Res => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});

export const getSaveErrorMsg = (e: unknown): string => {
  if (e instanceof Error) {
    return e.message;
  }

  return ErrMsg.NOT_INSTANCE_OF_ERROR;
};
