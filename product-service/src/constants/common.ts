export const basicHeaders = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

export enum HttpMethod {
  /** HTTP ANY */
  ANY = 'ANY',
  /** HTTP DELETE */
  DELETE = 'DELETE',
  /** HTTP GET */
  GET = 'GET',
  /** HTTP HEAD */
  HEAD = 'HEAD',
  /** HTTP OPTIONS */
  OPTIONS = 'OPTIONS',
  /** HTTP PATCH */
  PATCH = 'PATCH',
  /** HTTP POST */
  POST = 'POST',
  /** HTTP PUT */
  PUT = 'PUT',
}

export enum HttpStatusCode {
  /**
   * 200 OK
   * The request succeeded
   */
  OK = 200,
  /**
   * 400 Bad Request
   * The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
   */
  BAD_REQUEST = 400,
  /**
   * 404 Not Found
   * The server cannot find the requested resource.
   */
  NOT_FOUND = 404,
  /**
   * 405 Method Not Allowed
   * The request method is known by the server but is not supported by the target resource.
   */
  METHOD_NOT_ALLOWED = 405,
  /**
   * 422 Unprocessable Conten
   * The request was well-formed but was unable to be followed due to semantic errors.
   */
  UNPROCESSABLE_CONTENT = 422,
  /**
   * 500 Internal Server Error
   * The server has encountered a situation it does not know how to handle.
   */
  INTERNAL_SERVER_ERROR = 500,
}

export enum ErrMsg {
  INVALID_HTTP_METHOD = 'Invalid HTTP method',
  NOT_INSTANCE_OF_ERROR = 'Failed to do something exceptional',
  MISSING_ID = 'Missing path parameter: id',
  MISSING_BODY = 'Required request body is missing',
  BODY_INVALID = 'The provided body does not match the schema',
  DOES_NOT_EXIST = `Product with such id doesn't exist`,
  DB_ERROR = 'A database operation failed while processing the request.',
}
