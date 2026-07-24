import { Identifier, DomainPrimitive } from '@saas/domain';

export class ReportId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ReportId { return new ReportId(value); }
  public static generate(): ReportId { return new ReportId(crypto.randomUUID()); }
}

export class ReportCode extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ReportCode {
    if (!value || value.trim() === '') throw new Error('ReportCode cannot be empty');
    return new ReportCode(value);
  }
}

export enum ReportTypeEnum {
  ADHOC = 'ADHOC',
  SCHEDULED = 'SCHEDULED',
  SYSTEM = 'SYSTEM'
}

export class ReportType extends DomainPrimitive<ReportTypeEnum> {
  private constructor(value: ReportTypeEnum) { super(value); }
  public static create(value: ReportTypeEnum): ReportType {
    if (!Object.values(ReportTypeEnum).includes(value)) throw new Error(`Invalid ReportType: ${value}`);
    return new ReportType(value);
  }
}

export enum ReportCategoryEnum {
  EXECUTIVE = 'EXECUTIVE',
  FINANCIAL = 'FINANCIAL',
  SALES = 'SALES',
  CRM = 'CRM',
  MARKETING = 'MARKETING',
  INVENTORY = 'INVENTORY',
  KITCHEN = 'KITCHEN',
  RESERVATION = 'RESERVATION',
  WORKFORCE = 'WORKFORCE',
  OPERATIONAL = 'OPERATIONAL',
  COMPLIANCE = 'COMPLIANCE',
  AUDIT = 'AUDIT'
}

export class ReportCategory extends DomainPrimitive<ReportCategoryEnum> {
  private constructor(value: ReportCategoryEnum) { super(value); }
  public static create(value: ReportCategoryEnum): ReportCategory {
    if (!Object.values(ReportCategoryEnum).includes(value)) throw new Error(`Invalid ReportCategory: ${value}`);
    return new ReportCategory(value);
  }
}

export enum ReportPeriodEnum {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM'
}

export class ReportPeriod extends DomainPrimitive<ReportPeriodEnum> {
  private constructor(value: ReportPeriodEnum) { super(value); }
  public static create(value: ReportPeriodEnum): ReportPeriod {
    if (!Object.values(ReportPeriodEnum).includes(value)) throw new Error(`Invalid ReportPeriod: ${value}`);
    return new ReportPeriod(value);
  }
}

export enum ReportFormatEnum {
  PDF = 'PDF',
  XLSX = 'XLSX',
  CSV = 'CSV',
  JSON = 'JSON',
  XML = 'XML'
}

export class ReportFormat extends DomainPrimitive<ReportFormatEnum> {
  private constructor(value: ReportFormatEnum) { super(value); }
  public static create(value: ReportFormatEnum): ReportFormat {
    if (!Object.values(ReportFormatEnum).includes(value)) throw new Error(`Invalid ReportFormat: ${value}`);
    return new ReportFormat(value);
  }
}

export enum ReportStatusEnum {
  PENDING = 'PENDING',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ARCHIVED = 'ARCHIVED'
}

export class ReportStatus extends DomainPrimitive<ReportStatusEnum> {
  private constructor(value: ReportStatusEnum) { super(value); }
  public static create(value: ReportStatusEnum): ReportStatus {
    if (!Object.values(ReportStatusEnum).includes(value)) throw new Error(`Invalid ReportStatus: ${value}`);
    return new ReportStatus(value);
  }
}
