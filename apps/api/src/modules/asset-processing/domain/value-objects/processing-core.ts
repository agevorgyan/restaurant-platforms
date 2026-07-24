import { Identifier, DomainPrimitive } from '@saas/domain';

// ENUMS

export enum ProcessingStatusEnum {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export class ProcessingStatus extends DomainPrimitive<ProcessingStatusEnum> {
  private constructor(value: ProcessingStatusEnum) { super(value); }
  public static create(value: ProcessingStatusEnum): ProcessingStatus {
    return new ProcessingStatus(value);
  }
}

export enum ProcessorTypeEnum {
  IMAGE = 'IMAGE',
  PDF = 'PDF',
  OCR = 'OCR',
  VIRUS_SCAN = 'VIRUS_SCAN',
  COMPRESSION = 'COMPRESSION',
  METADATA = 'METADATA',
  CHECKSUM = 'CHECKSUM'
}

export class ProcessorType extends DomainPrimitive<ProcessorTypeEnum> {
  private constructor(value: ProcessorTypeEnum) { super(value); }
  public static create(value: ProcessorTypeEnum): ProcessorType {
    return new ProcessorType(value);
  }
}

export enum ProcessingPriorityEnum {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export class ProcessingPriority extends DomainPrimitive<ProcessingPriorityEnum> {
  private constructor(value: ProcessingPriorityEnum) { super(value); }
  public static create(value: ProcessingPriorityEnum): ProcessingPriority {
    return new ProcessingPriority(value);
  }
}

// VALUE OBJECTS

export class ProcessingJobId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ProcessingJobId { return new ProcessingJobId(value); }
  public static generate(): ProcessingJobId { return new ProcessingJobId(crypto.randomUUID()); }
}

export interface ProcessingStageProps {
  stageName: string;
  processorType: ProcessorTypeEnum;
  order: number;
}

export class ProcessingStage extends DomainPrimitive<ProcessingStageProps> {
  private constructor(value: ProcessingStageProps) { super(value); }
  public static create(value: ProcessingStageProps): ProcessingStage {
    return new ProcessingStage(value);
  }
}

export interface AssetReferenceProps {
  documentId: string;
  tenantId: string;
  mimeType: string;
  sizeBytes: number;
}

export class AssetReference extends DomainPrimitive<AssetReferenceProps> {
  private constructor(value: AssetReferenceProps) { super(value); }
  public static create(value: AssetReferenceProps): AssetReference {
    return new AssetReference(value);
  }
}

export interface ProcessingErrorProps {
  code: string;
  message: string;
  stageName?: string;
  timestamp: Date;
}

export class ProcessingError extends DomainPrimitive<ProcessingErrorProps> {
  private constructor(value: ProcessingErrorProps) { super(value); }
  public static create(value: ProcessingErrorProps): ProcessingError {
    return new ProcessingError(value);
  }
}

export interface ProcessingResultProps {
  jobId: string;
  status: ProcessingStatusEnum;
  outputArtifacts?: Record<string, string>; // e.g., { "thumbnail": "s3://.../thumb.jpg" }
  extractedMetadata?: Record<string, any>;
  errors?: ProcessingErrorProps[];
  completedAt?: Date;
}

export class ProcessingResult extends DomainPrimitive<ProcessingResultProps> {
  private constructor(value: ProcessingResultProps) { super(value); }
  public static create(value: ProcessingResultProps): ProcessingResult {
    return new ProcessingResult(value);
  }
}
