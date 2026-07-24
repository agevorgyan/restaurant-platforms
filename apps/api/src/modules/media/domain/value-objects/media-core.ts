import { Identifier, DomainPrimitive } from '@saas/domain';

// ENUMS

export enum MediaTypeEnum {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  ANIMATION = 'ANIMATION',
  VECTOR = 'VECTOR'
}

export enum MediaStatusEnum {
  UPLOADING = 'UPLOADING',
  AVAILABLE = 'AVAILABLE',
  PROCESSING = 'PROCESSING',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
  FAILED = 'FAILED'
}

export enum VisibilityPolicyEnum {
  PRIVATE = 'PRIVATE',
  TENANT = 'TENANT',
  PUBLIC = 'PUBLIC'
}

// VALUE OBJECTS

export class MediaId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): MediaId { return new MediaId(value); }
  public static generate(): MediaId { return new MediaId(crypto.randomUUID()); }
}

export class TenantId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): TenantId { return new TenantId(value); }
}

export class MediaType extends DomainPrimitive<MediaTypeEnum> {
  private constructor(value: MediaTypeEnum) { super(value); }
  public static create(value: MediaTypeEnum): MediaType { return new MediaType(value); }
}

export class MediaFormat extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): MediaFormat { return new MediaFormat(value.toLowerCase()); }
}

export class MimeType extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): MimeType { return new MimeType(value.toLowerCase()); }
}

export interface ResolutionProps {
  width: number;
  height: number;
}

export class Resolution extends DomainPrimitive<ResolutionProps> {
  private constructor(value: ResolutionProps) { super(value); }
  public static create(value: ResolutionProps): Resolution {
    if (value.width <= 0 || value.height <= 0) throw new Error('Resolution dimensions must be positive');
    return new Resolution(value);
  }
}

export class AspectRatio extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AspectRatio { return new AspectRatio(value); }
}

export class Duration extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): Duration {
    if (value < 0) throw new Error('Duration cannot be negative');
    return new Duration(value);
  }
}

export class Bitrate extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): Bitrate { return new Bitrate(value); }
}

export class ColorProfile extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ColorProfile { return new ColorProfile(value); }
}

export class FileSize extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): FileSize {
    if (value < 0) throw new Error('FileSize cannot be negative');
    return new FileSize(value);
  }
}

export class Checksum extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): Checksum { return new Checksum(value); }
}

export class MediaStatus extends DomainPrimitive<MediaStatusEnum> {
  private constructor(value: MediaStatusEnum) { super(value); }
  public static create(value: MediaStatusEnum): MediaStatus { return new MediaStatus(value); }
}

export class VisibilityPolicy extends DomainPrimitive<VisibilityPolicyEnum> {
  private constructor(value: VisibilityPolicyEnum) { super(value); }
  public static create(value: VisibilityPolicyEnum): VisibilityPolicy { return new VisibilityPolicy(value); }
}

export class MediaPurpose extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): MediaPurpose { return new MediaPurpose(value); }
}
