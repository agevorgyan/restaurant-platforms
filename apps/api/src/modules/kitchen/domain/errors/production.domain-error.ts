export class ProductionDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductionDomainError';
  }
}
