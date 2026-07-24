import { Identifier, DomainPrimitive } from '@saas/domain';

export class OpportunityId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): OpportunityId { return new OpportunityId(value); }
  public static generate(): OpportunityId { return new OpportunityId(crypto.randomUUID()); }
}

export class OpportunityNumber extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): OpportunityNumber {
    if (!value || value.trim().length === 0) throw new Error('Opportunity number cannot be empty.');
    return new OpportunityNumber(value);
  }
}

export enum OpportunityStatusEnum {
  OPEN = 'OPEN',
  WON = 'WON',
  LOST = 'LOST',
  ARCHIVED = 'ARCHIVED'
}

export class OpportunityStatus extends DomainPrimitive<OpportunityStatusEnum> {
  private constructor(value: OpportunityStatusEnum) { super(value); }
  public static create(value: OpportunityStatusEnum): OpportunityStatus {
    if (!Object.values(OpportunityStatusEnum).includes(value)) throw new Error(`Invalid status: ${value}`);
    return new OpportunityStatus(value);
  }
}

export enum OpportunityStageEnum {
  DISCOVERY = 'DISCOVERY',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED = 'CLOSED'
}

export class OpportunityStage extends DomainPrimitive<OpportunityStageEnum> {
  private constructor(value: OpportunityStageEnum) { super(value); }
  public static create(value: OpportunityStageEnum): OpportunityStage {
    if (!Object.values(OpportunityStageEnum).includes(value)) throw new Error(`Invalid stage: ${value}`);
    return new OpportunityStage(value);
  }
}

export class OpportunitySource extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): OpportunitySource {
    return new OpportunitySource(value);
  }
}

export class EstimatedCloseDate extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): EstimatedCloseDate {
    return new EstimatedCloseDate(value);
  }
}

export class WinProbability extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): WinProbability {
    if (value < 0 || value > 100) throw new Error('Win probability must be between 0 and 100.');
    return new WinProbability(value);
  }
}

export class Currency extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): Currency {
    if (value.length !== 3) throw new Error('Currency must be a 3-letter code.');
    return new Currency(value.toUpperCase());
  }
}

// ExpectedRevenue and Priority are exported from Lead for reuse if needed,
// but for purity we redefine Priority here if context slightly differs, 
// or import from lead-core. We will redefine to keep contexts self-sufficient.

export class OpportunityPriority extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): OpportunityPriority {
    const valid = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    if (!valid.includes(value)) throw new Error('Invalid priority.');
    return new OpportunityPriority(value);
  }
}
