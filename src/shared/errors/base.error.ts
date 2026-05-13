export class BaseError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly errorCode?: string,
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}