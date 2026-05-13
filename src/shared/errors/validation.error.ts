import { BaseError } from './base.error';

export class ValidationError extends BaseError {
  constructor(
    message = 'Validation failed',
    errorCode = 'VALIDATION_ERROR',
  ) {
    super(message, 422, errorCode);
  }
}