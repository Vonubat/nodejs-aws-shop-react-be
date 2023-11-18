export const buildResponse = (statusCode: number, body: any, headers: HeadersInit): Response =>
  new Response(JSON.stringify(body), { status: statusCode, headers });

// export const checkBodyParams = (requiredParams, key);

export const getSaveErrorMsg = (e: unknown): string => {
  if (e instanceof Error) {
    return e.message;
  }

  return 'Failed to do something exceptional';
};
