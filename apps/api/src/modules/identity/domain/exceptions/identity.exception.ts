export class IdentityDomainException extends Error {
  constructor(message: string, public readonly code: string = 'IDENTITY_ERROR') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UserNotFoundException extends IdentityDomainException {
  constructor(identifier: string) {
    super(`User not found with identifier: ${identifier}`, 'USER_NOT_FOUND');
  }
}
