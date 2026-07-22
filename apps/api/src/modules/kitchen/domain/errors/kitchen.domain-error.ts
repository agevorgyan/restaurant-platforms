export class KitchenDomainError extends Error {
  public readonly code = 'KITCHEN.DOMAIN_ERROR';

  constructor(message: string, public readonly metadata?: unknown) {
    super(message);
    this.name = 'KitchenDomainError';
  }
}
