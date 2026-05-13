import { BaseError } from './base.error';

export class UnauthorizedError extends BaseError {
  constructor(
    message = 'Unauthorized',
    errorCode = 'UNAUTHORIZED',
  ) {
    super(message, 401, errorCode);
  }
}