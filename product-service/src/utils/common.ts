import { Res } from '../constants';

export const buildResponse = (statusCode: number, body: Record<string, any>, headers: Record<string, any>): Res => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});

export const getSaveErrorMsg = (e: unknown): string => {
  if (e instanceof Error) {
    return e.message;
  }

  return 'Failed to do something exceptional';
};
