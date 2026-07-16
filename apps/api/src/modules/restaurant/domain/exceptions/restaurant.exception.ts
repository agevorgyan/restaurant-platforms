export class RestaurantDomainException extends Error {
  constructor(message: string, public readonly code: string = 'RESTAURANT_ERROR') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class RestaurantNotFoundException extends RestaurantDomainException {
  constructor(identifier: string) {
    super(`Restaurant not found with identifier: ${identifier}`, 'RESTAURANT_NOT_FOUND');
  }
}
