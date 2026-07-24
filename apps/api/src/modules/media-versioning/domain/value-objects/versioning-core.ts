import { Identifier, DomainPrimitive } from '@saas/domain';

// ENUMS

export enum LifecycleStateEnum {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
  EXPIRED = 'EXPIRED'
}

export class LifecycleState extends DomainPrimitive<LifecycleStateEnum> {
  private constructor(value: LifecycleStateEnum) { super(value); }
  public static create(value: LifecycleStateEnum): LifecycleState { return new LifecycleState(value); }
}

export enum VersionStatusEnum {
  CURRENT = 'CURRENT',
  PREVIOUS = 'PREVIOUS',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED'
}

export class VersionStatus extends DomainPrimitive<VersionStatusEnum> {
  private constructor(value: VersionStatusEnum) { super(value); }
  public static create(value: VersionStatusEnum): VersionStatus { return new VersionStatus(value); }
}

// VALUE OBJECTS

export class MediaVersionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): MediaVersionId { return new MediaVersionId(value); }
  public static generate(): MediaVersionId { return new MediaVersionId(crypto.randomUUID()); }
}

export class VersionNumber extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): VersionNumber {
    if (value < 1) throw new Error('Version number must be greater than 0');
    return new VersionNumber(value);
  }
}

export class RevisionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): RevisionId { return new RevisionId(value); }
}

export interface LifecyclePolicyProps {
  policyId: string;
  name: string;
  archiveAfterDays?: number;
  deleteAfterDays?: number;
}

export class LifecyclePolicy extends DomainPrimitive<LifecyclePolicyProps> {
  private constructor(value: LifecyclePolicyProps) { super(value); }
  public static create(value: LifecyclePolicyProps): LifecyclePolicy { return new LifecyclePolicy(value); }
}

export class RetentionPolicy extends DomainPrimitive<number> { // days to retain
  private constructor(value: number) { super(value); }
  public static create(value: number): RetentionPolicy { return new RetentionPolicy(value); }
}

export interface ArchivePolicyProps {
  storageTier: 'GLACIER' | 'DEEP_ARCHIVE' | 'COLD_HDD';
  transitionAfterDays: number;
}

export class ArchivePolicy extends DomainPrimitive<ArchivePolicyProps> {
  private constructor(value: ArchivePolicyProps) { super(value); }
  public static create(value: ArchivePolicyProps): ArchivePolicy { return new ArchivePolicy(value); }
}

export class ExpirationDate extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): ExpirationDate { return new ExpirationDate(value); }
}

export class RetentionPeriod extends DomainPrimitive<number> { // days
  private constructor(value: number) { super(value); }
  public static create(value: number): RetentionPeriod { return new RetentionPeriod(value); }
}

export class RestoreToken extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): RestoreToken { return new RestoreToken(value); }
}

export interface VariantReferenceProps {
  variantId: string;
  storageKey: string;
  type: string; // e.g., 'thumbnail', '1080p'
}

export class VariantReference extends DomainPrimitive<VariantReferenceProps> {
  private constructor(value: VariantReferenceProps) { super(value); }
  public static create(value: VariantReferenceProps): VariantReference { return new VariantReference(value); }
}

export interface TransformationReferenceProps {
  jobId: string;
  profileId: string;
  status: string;
}

export class TransformationReference extends DomainPrimitive<TransformationReferenceProps> {
  private constructor(value: TransformationReferenceProps) { super(value); }
  public static create(value: TransformationReferenceProps): TransformationReference { return new TransformationReference(value); }
}
