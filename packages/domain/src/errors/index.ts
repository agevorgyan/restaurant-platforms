export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class BusinessRuleViolation extends DomainError {}
export class InvariantViolation extends DomainError {}
export class ValidationFailure extends DomainError {}
export class ConcurrencyError extends DomainError {}
