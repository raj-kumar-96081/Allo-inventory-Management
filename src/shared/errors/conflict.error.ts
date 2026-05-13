import { BaseError } from './base.error';

export class ConflictError extends BaseError {
  constructor(
    message = 'Conflict occurred',
    errorCode = 'CONFLICT_ERROR',
  ) {
    super(message, 409, errorCode);
  }
}