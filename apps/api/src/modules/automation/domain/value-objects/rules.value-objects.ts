export class RuleId {
  constructor(public readonly value: string) {}
}

export class RuleVersion {
  constructor(public readonly value: string) {}
}

export class RuleDefinition {
  constructor(
    public readonly name: string,
    public readonly expression: RuleExpression,
    public readonly actions: RuleAction[],
  ) {}
}

export class RuleExpression {
  constructor(
    public readonly type: string,
    public readonly logic: string,
  ) {}
}

export class RuleCondition {
  constructor(
    public readonly field: string,
    public readonly operator: string,
    public readonly value: any,
  ) {}
}

export class RuleAction {
  constructor(
    public readonly type: string,
    public readonly parameters: Record<string, any>,
  ) {}
}

export class RulePriority {
  constructor(public readonly value: number) {}
}

export class RuleResult {
  constructor(
    public readonly isMatched: boolean,
    public readonly firedActions: RuleAction[],
    public readonly executionTimeMs: number,
  ) {}
}

export class RuleContext {
  constructor(
    public readonly facts: Record<string, any>,
    public readonly tenantId: string,
  ) {}
}

export class DecisionId {
  constructor(public readonly value: string) {}
}

export class DecisionTable {
  constructor(
    public readonly inputs: string[],
    public readonly outputs: string[],
    public readonly rules: Array<{
      inputValues: any[];
      outputValues: any[];
    }>,
  ) {}
}

export class PolicyDefinition {
  constructor(
    public readonly rulesetId: string,
    public readonly priority: RulePriority,
  ) {}
}
