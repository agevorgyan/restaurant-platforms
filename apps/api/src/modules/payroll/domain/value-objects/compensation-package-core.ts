import { Identifier, DomainPrimitive } from '@saas/domain';

export class CompensationPackageId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CompensationPackageId { return new CompensationPackageId(value); }
  public static generate(): CompensationPackageId { return new CompensationPackageId(crypto.randomUUID()); }
}

export enum CompensationTypeEnum {
  SALARIED = 'SALARIED',
  HOURLY = 'HOURLY',
  CONTRACTOR = 'CONTRACTOR'
}

export class CompensationType extends DomainPrimitive<CompensationTypeEnum> {
  private constructor(value: CompensationTypeEnum) { super(value); }
  public static create(value: CompensationTypeEnum): CompensationType {
    if (!Object.values(CompensationTypeEnum).includes(value)) {
      throw new Error(`Invalid compensation type: ${value}`);
    }
    return new CompensationType(value);
  }
}

export enum CompensationStatusEnum {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  DEACTIVATED = 'DEACTIVATED',
  ARCHIVED = 'ARCHIVED'
}

export class CompensationStatus extends DomainPrimitive<CompensationStatusEnum> {
  private constructor(value: CompensationStatusEnum) { super(value); }
  public static create(value: CompensationStatusEnum): CompensationStatus {
    if (!Object.values(CompensationStatusEnum).includes(value)) {
      throw new Error(`Invalid compensation status: ${value}`);
    }
    return new CompensationStatus(value);
  }
}

export interface EffectivePeriodProps {
  startDate: Date;
  endDate?: Date;
}

export class EffectivePeriod extends DomainPrimitive<EffectivePeriodProps> {
  private constructor(value: EffectivePeriodProps) { super(value); }
  public static create(value: EffectivePeriodProps): EffectivePeriod {
    if (value.endDate && value.startDate > value.endDate) {
      throw new Error('Start date cannot be after end date.');
    }
    return new EffectivePeriod(value);
  }
}
