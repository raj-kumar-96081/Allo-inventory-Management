import { BaseError } from './base.error';

export class NotFoundError extends BaseError {
  constructor(
    message = 'Resource not found',
    errorCode = 'NOT_FOUND',
  ) {
    super(message, 404, errorCode);
  }
}