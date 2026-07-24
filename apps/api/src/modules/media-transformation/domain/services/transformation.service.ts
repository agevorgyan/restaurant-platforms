import { TransformationProfile, TransformationJobId, TransformationTypeEnum } from '../value-objects';

export interface ITransformationProcessor {
  supports(type: TransformationTypeEnum): boolean;
  process(jobId: string, mediaId: string, tenantId: string, parameters: Record<string, any>): Promise<Record<string, string>>;
}

export class ImageTransformationService implements ITransformationProcessor {
  public supports(type: TransformationTypeEnum): boolean {
    return [
      TransformationTypeEnum.IMAGE_RESIZE,
      TransformationTypeEnum.THUMBNAIL,
      TransformationTypeEnum.RESPONSIVE,
      TransformationTypeEnum.CROP,
      TransformationTypeEnum.WATERMARK,
      TransformationTypeEnum.FORMAT_CONVERSION
    ].includes(type);
  }

  public async process(jobId: string, mediaId: string, tenantId: string, parameters: Record<string, any>): Promise<Record<string, string>> {
    // Abstract interface for external processing via Sharp / Imgix / Cloudflare Images
    return { "output": `tenant/${tenantId}/media/${mediaId}_processed_${jobId}.jpg` };
  }
}

export class VideoTransformationService implements ITransformationProcessor {
  public supports(type: TransformationTypeEnum): boolean {
    return type === TransformationTypeEnum.VIDEO_TRANSCODE;
  }

  public async process(jobId: string, mediaId: string, tenantId: string, parameters: Record<string, any>): Promise<Record<string, string>> {
    // AWS Elemental MediaConvert / FFmpeg abstraction
    return { "playlist": `tenant/${tenantId}/media/${mediaId}/hls/index.m3u8` };
  }
}

export class AudioTransformationService implements ITransformationProcessor {
  public supports(type: TransformationTypeEnum): boolean {
    return type === TransformationTypeEnum.AUDIO_NORMALIZE;
  }

  public async process(jobId: string, mediaId: string, tenantId: string, parameters: Record<string, any>): Promise<Record<string, string>> {
    return { "audio": `tenant/${tenantId}/media/${mediaId}_normalized.mp3` };
  }
}

export class MetadataExtractionService implements ITransformationProcessor {
  public supports(type: TransformationTypeEnum): boolean {
    return false; // Typically implicit or generic step, distinct from visual transformations
  }

  public async process(jobId: string, mediaId: string, tenantId: string, parameters: Record<string, any>): Promise<Record<string, string>> {
    return { "metadata": `tenant/${tenantId}/media/${mediaId}_meta.json` };
  }
}

export class TransformationRegistry {
  private processors: ITransformationProcessor[] = [];

  public register(processor: ITransformationProcessor): void {
    this.processors.push(processor);
  }

  public getProcessorFor(type: TransformationTypeEnum): ITransformationProcessor {
    const processor = this.processors.find(p => p.supports(type));
    if (!processor) {
      throw new Error(`No processor found for transformation type: ${type}`);
    }
    return processor;
  }
}

export class TransformationPipelineService {
  constructor(private readonly registry: TransformationRegistry) {}

  public async executeProfile(jobId: TransformationJobId, mediaId: string, tenantId: string, profile: TransformationProfile): Promise<Record<string, string>> {
    const results: Record<string, string> = {};
    const steps = profile.toValue().steps;

    for (const step of steps) {
      const processor = this.registry.getProcessorFor(step.type);
      const stepResult = await processor.process(jobId.toValue(), mediaId, tenantId, step.parameters);
      Object.assign(results, stepResult);
    }

    return results;
  }
}

export class TransformationScheduler {
  public scheduleJob(mediaId: string, tenantId: string, profileId: string): TransformationJobId {
    // Sends job payload to BullMQ / SQS for async consumption
    return TransformationJobId.generate();
  }
}

export class MediaTransformationService {
  constructor(
    private readonly scheduler: TransformationScheduler,
    private readonly pipeline: TransformationPipelineService
  ) {}

  public async triggerTransformation(mediaId: string, tenantId: string, profileId: string): Promise<string> {
    const jobId = this.scheduler.scheduleJob(mediaId, tenantId, profileId);
    return jobId.toValue();
  }
}
