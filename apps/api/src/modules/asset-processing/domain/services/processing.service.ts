import { 
  AssetReferenceProps, 
  ProcessingJobId, 
  ProcessorTypeEnum,
  ProcessingResultProps,
  ProcessingStatusEnum
} from '../value-objects';

export interface IAssetProcessor {
  readonly type: ProcessorTypeEnum;
  process(asset: AssetReferenceProps): Promise<Partial<ProcessingResultProps>>;
}

export class ImageProcessingService implements IAssetProcessor {
  readonly type = ProcessorTypeEnum.IMAGE;
  
  async process(asset: AssetReferenceProps): Promise<Partial<ProcessingResultProps>> {
    console.log(`[ImageProcessingService] Processing image for doc ${asset.documentId}`);
    return {
      outputArtifacts: {
        thumbnail: 's3://bucket/thumb.jpg',
        optimized: 's3://bucket/optimized.webp'
      }
    };
  }
}

export class PreviewGenerationService implements IAssetProcessor {
  readonly type = ProcessorTypeEnum.PDF;

  async process(asset: AssetReferenceProps): Promise<Partial<ProcessingResultProps>> {
    console.log(`[PreviewGenerationService] Generating preview for doc ${asset.documentId}`);
    return {
      outputArtifacts: {
        preview: 's3://bucket/preview.pdf'
      }
    };
  }
}

export class MetadataExtractionService implements IAssetProcessor {
  readonly type = ProcessorTypeEnum.METADATA;

  async process(asset: AssetReferenceProps): Promise<Partial<ProcessingResultProps>> {
    console.log(`[MetadataExtractionService] Extracting metadata for doc ${asset.documentId}`);
    return {
      extractedMetadata: {
        width: 1920,
        height: 1080,
        format: 'JPEG'
      }
    };
  }
}

export class VirusScanningService implements IAssetProcessor {
  readonly type = ProcessorTypeEnum.VIRUS_SCAN;

  async process(asset: AssetReferenceProps): Promise<Partial<ProcessingResultProps>> {
    console.log(`[VirusScanningService] Scanning doc ${asset.documentId}`);
    return {
      extractedMetadata: {
        isSafe: true,
        scannedAt: new Date().toISOString()
      }
    };
  }
}

export class ProcessorRegistry {
  private processors = new Map<ProcessorTypeEnum, IAssetProcessor>();

  constructor() {
    this.register(new ImageProcessingService());
    this.register(new PreviewGenerationService());
    this.register(new MetadataExtractionService());
    this.register(new VirusScanningService());
  }

  register(processor: IAssetProcessor): void {
    this.processors.set(processor.type, processor);
  }

  get(type: ProcessorTypeEnum): IAssetProcessor {
    const processor = this.processors.get(type);
    if (!processor) throw new Error(`Processor not found for type: ${type}`);
    return processor;
  }
}

export class ProcessingPipelineService {
  constructor(private readonly registry: ProcessorRegistry) {}

  async executePipeline(jobId: string, asset: AssetReferenceProps, pipeline: ProcessorTypeEnum[]): Promise<ProcessingResultProps> {
    const result: ProcessingResultProps = {
      jobId,
      status: ProcessingStatusEnum.RUNNING,
      outputArtifacts: {},
      extractedMetadata: {},
      errors: []
    };

    for (const stage of pipeline) {
      try {
        const processor = this.registry.get(stage);
        const stageResult = await processor.process(asset);
        
        result.outputArtifacts = { ...result.outputArtifacts, ...stageResult.outputArtifacts };
        result.extractedMetadata = { ...result.extractedMetadata, ...stageResult.extractedMetadata };
      } catch (error: any) {
        result.errors?.push({
          code: 'PROCESSOR_ERROR',
          message: error.message,
          stageName: stage,
          timestamp: new Date()
        });
        
        if (stage === ProcessorTypeEnum.VIRUS_SCAN) {
          result.status = ProcessingStatusEnum.FAILED;
          return result; // Halt pipeline on critical failure
        }
      }
    }

    if (result.errors && result.errors.length > 0 && result.status !== ProcessingStatusEnum.FAILED) {
      result.status = ProcessingStatusEnum.COMPLETED; // Partial success
    } else {
      result.status = ProcessingStatusEnum.COMPLETED;
    }
    
    result.completedAt = new Date();
    return result;
  }
}

export class JobScheduler {
  async enqueue(asset: AssetReferenceProps, pipeline: ProcessorTypeEnum[]): Promise<string> {
    const jobId = ProcessingJobId.generate().toValue();
    console.log(`[JobScheduler] Enqueued job ${jobId} for doc ${asset.documentId}`);
    // In production: Publish to BullMQ or Enterprise Event Bus
    return jobId;
  }
}

export class AssetProcessingService {
  constructor(
    private readonly scheduler: JobScheduler,
    private readonly pipelineService: ProcessingPipelineService
  ) {}

  public async initiateProcessing(asset: AssetReferenceProps): Promise<string> {
    // Determine pipeline based on mime type
    const pipeline: ProcessorTypeEnum[] = [ProcessorTypeEnum.VIRUS_SCAN]; // Always scan

    if (asset.mimeType.startsWith('image/')) {
      pipeline.push(ProcessorTypeEnum.METADATA);
      pipeline.push(ProcessorTypeEnum.IMAGE);
    } else if (asset.mimeType === 'application/pdf') {
      pipeline.push(ProcessorTypeEnum.PDF);
    }

    const jobId = await this.scheduler.enqueue(asset, pipeline);
    
    // Simulate async execution (would typically happen in a worker process)
    setTimeout(() => {
      this.pipelineService.executePipeline(jobId, asset, pipeline).then(res => {
        console.log(`[AssetProcessingService] Job ${jobId} completed with status: ${res.status}`);
      });
    }, 100);

    return jobId;
  }
}
