import {
  RuleId,
  RuleVersion,
  RuleContext,
  RuleResult,
  DecisionId,
} from '../value-objects';

export class RuleCreated {
  constructor(
    public readonly ruleId: RuleId,
    public readonly timestamp: Date,
  ) {}
}

export class RulePublished {
  constructor(
    public readonly ruleId: RuleId,
    public readonly version: RuleVersion,
    public readonly timestamp: Date,
  ) {}
}

export class RuleEvaluated {
  constructor(
    public readonly ruleId: RuleId,
    public readonly version: RuleVersion,
    public readonly context: RuleContext,
    public readonly result: RuleResult,
    public readonly timestamp: Date,
  ) {}
}

export class RuleMatched {
  constructor(
    public readonly ruleId: RuleId,
    public readonly version: RuleVersion,
    public readonly context: RuleContext,
    public readonly timestamp: Date,
  ) {}
}

export class RuleFailed {
  constructor(
    public readonly ruleId: RuleId,
    public readonly version: RuleVersion,
    public readonly reason: string,
    public readonly timestamp: Date,
  ) {}
}

export class PolicyResolved {
  constructor(
    public readonly policyId: string,
    public readonly matchedRulesCount: number,
    public readonly timestamp: Date,
  ) {}
}

export class DecisionExecuted {
  constructor(
    public readonly decisionId: DecisionId,
    public readonly context: RuleContext,
    public readonly outputs: Record<string, any>,
    public readonly timestamp: Date,
  ) {}
}
