/**
 * Custom HTTP Error Class that also exposes httpStatusCode, ApiResponse, rawHttpClientData
 * To expose more info for lib user
 */
class MidtransError extends Error {
  httpStatusCode: number | null;
  ApiResponse: unknown;
  rawHttpClientData: unknown;

  constructor(
    message: string,
    httpStatusCode: number | null = null,
    ApiResponse: unknown = null,
    rawHttpClientData: unknown = null,
  ) {
    super(message);
    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;

    this.httpStatusCode = httpStatusCode;
    this.ApiResponse = ApiResponse;
    this.rawHttpClientData = rawHttpClientData;
    // This clips the constructor invocation from the stack trace.
    Error.captureStackTrace(this, this.constructor);
  }
}

export default MidtransError;
