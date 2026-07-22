export class RecipeDomainError extends Error {
  public readonly code = 'RECIPE.DOMAIN_ERROR';

  constructor(message: string, public readonly metadata?: unknown) {
    super(message);
    this.name = 'RecipeDomainError';
  }
}
