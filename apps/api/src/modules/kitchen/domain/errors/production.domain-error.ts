export class ProductionDomainError extends Error {
  public readonly code = 'PRODUCTION.DOMAIN_ERROR';

  constructor(message: string, public readonly metadata?: unknown) {
    super(message);
    this.name = 'ProductionDomainError';
  }
}
