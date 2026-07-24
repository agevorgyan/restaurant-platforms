import { Identifier, DomainPrimitive } from '@saas/domain';

export class TaxProfileId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): TaxProfileId { return new TaxProfileId(value); }
  public static generate(): TaxProfileId { return new TaxProfileId(crypto.randomUUID()); }
}

export class TaxProfileCode extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): TaxProfileCode {
    if (!value || value.trim().length === 0) throw new Error('Tax profile code cannot be empty.');
    return new TaxProfileCode(value);
  }
}

export class TaxProfileName extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): TaxProfileName {
    if (!value || value.trim().length === 0) throw new Error('Tax profile name cannot be empty.');
    return new TaxProfileName(value);
  }
}

export class TaxJurisdiction extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): TaxJurisdiction {
    if (!value || value.trim().length === 0) throw new Error('Tax jurisdiction cannot be empty.');
    return new TaxJurisdiction(value);
  }
}

export class TaxResidency extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): TaxResidency {
    if (!value || value.trim().length === 0) throw new Error('Tax residency cannot be empty.');
    return new TaxResidency(value);
  }
}

export enum TaxStatusEnum {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  DEACTIVATED = 'DEACTIVATED',
  ARCHIVED = 'ARCHIVED'
}

export class TaxStatus extends DomainPrimitive<TaxStatusEnum> {
  private constructor(value: TaxStatusEnum) { super(value); }
  public static create(value: TaxStatusEnum): TaxStatus {
    if (!Object.values(TaxStatusEnum).includes(value)) {
      throw new Error(`Invalid tax status: ${value}`);
    }
    return new TaxStatus(value);
  }
}

export class TaxCategory extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): TaxCategory {
    if (!value || value.trim().length === 0) throw new Error('Tax category cannot be empty.');
    return new TaxCategory(value);
  }
}
