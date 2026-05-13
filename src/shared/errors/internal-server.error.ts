import { BaseError } from './base.error';

export class InternalServerError extends BaseError {
  constructor(
    message = 'Internal server error',
    errorCode = 'INTERNAL_SERVER_ERROR',
  ) {
    super(message, 500, errorCode);
  }
}