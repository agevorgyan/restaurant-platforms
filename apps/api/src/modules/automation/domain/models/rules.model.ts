import {
  RuleId,
  RuleVersion,
  RuleDefinition,
  RulePriority,
  DecisionId,
  DecisionTable,
} from '../value-objects';
import { RuleStatus } from '../enums/rules.enums';

export class BusinessRule {
  constructor(
    public readonly id: RuleId,
    public readonly version: RuleVersion,
    public readonly definition: RuleDefinition,
    public priority: RulePriority,
    public status: RuleStatus = RuleStatus.Draft,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  public publish(): void {
    if (this.status === RuleStatus.Published) {
      throw new Error('Rule is already published.');
    }
    this.status = RuleStatus.Published;
    this.updatedAt = new Date();
  }

  public deprecate(): void {
    this.status = RuleStatus.Deprecated;
    this.updatedAt = new Date();
  }
}

export class BusinessDecisionTable {
  constructor(
    public readonly id: DecisionId,
    public readonly name: string,
    public readonly table: DecisionTable,
    public isEnabled: boolean = true,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  public disable(): void {
    this.isEnabled = false;
    this.updatedAt = new Date();
  }

  public enable(): void {
    this.isEnabled = true;
    this.updatedAt = new Date();
  }
}
