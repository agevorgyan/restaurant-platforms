export class DomainRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class SpecificationError extends DomainRuleError {}
export class PolicyError extends DomainRuleError {}
export class RuleEvaluationError extends DomainRuleError {}
export class ValidationError extends DomainRuleError {}
