import { Identifier, DomainPrimitive } from '@saas/domain';

// ENUMS

export enum TransformationStatusEnum {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export class TransformationStatus extends DomainPrimitive<TransformationStatusEnum> {
  private constructor(value: TransformationStatusEnum) { super(value); }
  public static create(value: TransformationStatusEnum): TransformationStatus {
    return new TransformationStatus(value);
  }
}

export enum TransformationTypeEnum {
  IMAGE_RESIZE = 'IMAGE_RESIZE',
  THUMBNAIL = 'THUMBNAIL',
  RESPONSIVE = 'RESPONSIVE',
  CROP = 'CROP',
  ROTATE = 'ROTATE',
  WATERMARK = 'WATERMARK',
  COMPRESSION = 'COMPRESSION',
  FORMAT_CONVERSION = 'FORMAT_CONVERSION',
  VIDEO_TRANSCODE = 'VIDEO_TRANSCODE',
  AUDIO_NORMALIZE = 'AUDIO_NORMALIZE'
}

export class TransformationType extends DomainPrimitive<TransformationTypeEnum> {
  private constructor(value: TransformationTypeEnum) { super(value); }
  public static create(value: TransformationTypeEnum): TransformationType {
    return new TransformationType(value);
  }
}

export enum TransformationPriorityEnum {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  REALTIME = 'REALTIME'
}

export class TransformationPriority extends DomainPrimitive<TransformationPriorityEnum> {
  private constructor(value: TransformationPriorityEnum) { super(value); }
  public static create(value: TransformationPriorityEnum): TransformationPriority {
    return new TransformationPriority(value);
  }
}

// VALUE OBJECTS

export class TransformationJobId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): TransformationJobId { return new TransformationJobId(value); }
  public static generate(): TransformationJobId { return new TransformationJobId(crypto.randomUUID()); }
}

export interface TransformationProfileProps {
  profileId: string;
  name: string;
  steps: Array<{
    type: TransformationTypeEnum;
    parameters: Record<string, any>;
  }>;
}

export class TransformationProfile extends DomainPrimitive<TransformationProfileProps> {
  private constructor(value: TransformationProfileProps) { super(value); }
  public static create(value: TransformationProfileProps): TransformationProfile {
    return new TransformationProfile(value);
  }
}

export interface OutputResolutionProps {
  width: number;
  height: number;
}

export class OutputResolution extends DomainPrimitive<OutputResolutionProps> {
  private constructor(value: OutputResolutionProps) { super(value); }
  public static create(value: OutputResolutionProps): OutputResolution {
    return new OutputResolution(value);
  }
}

export class OutputFormat extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): OutputFormat { return new OutputFormat(value); }
}

export class OutputQuality extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): OutputQuality {
    if (value < 1 || value > 100) throw new Error('Quality must be between 1 and 100');
    return new OutputQuality(value);
  }
}

export interface TransformationErrorProps {
  code: string;
  message: string;
  stageType?: TransformationTypeEnum;
  timestamp: Date;
}

export class TransformationError extends DomainPrimitive<TransformationErrorProps> {
  private constructor(value: TransformationErrorProps) { super(value); }
  public static create(value: TransformationErrorProps): TransformationError {
    return new TransformationError(value);
  }
}

export interface TransformationResultProps {
  jobId: string;
  status: TransformationStatusEnum;
  artifacts?: Record<string, string>; // e.g., { "1080p": "s3://.../1080p.mp4" }
  metadata?: Record<string, any>;
  errors?: TransformationErrorProps[];
  completedAt?: Date;
}

export class TransformationResult extends DomainPrimitive<TransformationResultProps> {
  private constructor(value: TransformationResultProps) { super(value); }
  public static create(value: TransformationResultProps): TransformationResult {
    return new TransformationResult(value);
  }
}
