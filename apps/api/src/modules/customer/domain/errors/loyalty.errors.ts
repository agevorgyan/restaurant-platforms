export class LoyaltyDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoyaltyDomainError';
  }
}