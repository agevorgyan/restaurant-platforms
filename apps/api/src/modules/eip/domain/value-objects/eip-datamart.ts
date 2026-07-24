import { Identifier, DomainPrimitive } from '@saas/domain';

export class ProjectionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ProjectionId { return new ProjectionId(value); }
  public static generate(): ProjectionId { return new ProjectionId(crypto.randomUUID()); }
}

export class SnapshotId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): SnapshotId { return new SnapshotId(value); }
  public static generate(): SnapshotId { return new SnapshotId(crypto.randomUUID()); }
}

export class DatasetId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): DatasetId { return new DatasetId(value); }
  public static generate(): DatasetId { return new DatasetId(crypto.randomUUID()); }
}

export class ProjectionVersion extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): ProjectionVersion {
    if (value <= 0) throw new Error('ProjectionVersion must be greater than zero.');
    return new ProjectionVersion(value);
  }
}

export enum SnapshotPeriodEnum {
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

export class SnapshotPeriod extends DomainPrimitive<SnapshotPeriodEnum> {
  private constructor(value: SnapshotPeriodEnum) { super(value); }
  public static create(value: SnapshotPeriodEnum): SnapshotPeriod {
    if (!Object.values(SnapshotPeriodEnum).includes(value)) throw new Error(`Invalid SnapshotPeriod: ${value}`);
    return new SnapshotPeriod(value);
  }
}

export enum RefreshPolicyEnum {
  REAL_TIME = 'REAL_TIME',
  NEAR_REAL_TIME = 'NEAR_REAL_TIME',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MANUAL = 'MANUAL'
}

export class RefreshPolicy extends DomainPrimitive<RefreshPolicyEnum> {
  private constructor(value: RefreshPolicyEnum) { super(value); }
  public static create(value: RefreshPolicyEnum): RefreshPolicy {
    if (!Object.values(RefreshPolicyEnum).includes(value)) throw new Error(`Invalid RefreshPolicy: ${value}`);
    return new RefreshPolicy(value);
  }
}

export enum RetentionPolicyEnum {
  HOT = 'HOT',
  WARM = 'WARM',
  COLD = 'COLD',
  ARCHIVE = 'ARCHIVE'
}

export class RetentionPolicy extends DomainPrimitive<RetentionPolicyEnum> {
  private constructor(value: RetentionPolicyEnum) { super(value); }
  public static create(value: RetentionPolicyEnum): RetentionPolicy {
    if (!Object.values(RetentionPolicyEnum).includes(value)) throw new Error(`Invalid RetentionPolicy: ${value}`);
    return new RetentionPolicy(value);
  }
}
