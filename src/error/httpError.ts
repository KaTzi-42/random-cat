export class HttpError extends Error {
  code: number;
  context?: unknown;

  constructor(statusCode: number, message: string, context?: unknown) {
    super();
    this.code = statusCode;
    this.message = message;
    this.context = context;
  }
}
