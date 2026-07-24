import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { MediaTransformationService } from '../../domain/services';
import { TransformationJob, TransformationStatistics, TransformationHealth } from '../../application/read-models';

@Controller('media/transformations')
export class EnterpriseTransformationController {
  constructor(private readonly transformationService: MediaTransformationService) {}

  @Get()
  async listJobs(
    @Query('tenantId') tenantId: string,
    @Query('mediaId') mediaId?: string
  ): Promise<TransformationJob[]> {
    if (!tenantId) throw new Error('tenantId is required');
    return []; // Mock return for compilation
  }

  @Get('statistics')
  async getStatistics(@Query('tenantId') tenantId: string): Promise<TransformationStatistics> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      totalJobs: 5000,
      completedJobs: 4950,
      failedJobs: 50,
      averageLatencyMs: 1250,
      period: new Date().toISOString().slice(0, 7)
    };
  }

  @Get('health')
  async getHealth(): Promise<TransformationHealth> {
    return {
      status: 'HEALTHY',
      activeWorkers: 12,
      queuedJobs: 0,
      deadLetterJobs: 2,
      averageWaitTimeMs: 45
    };
  }

  @Get(':id')
  async getJob(@Param('id') id: string, @Query('tenantId') tenantId: string): Promise<TransformationJob> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      jobId: id,
      tenantId,
      mediaId: 'media-123',
      profileId: 'default-image',
      status: 'COMPLETED',
      priority: 'NORMAL',
      createdAt: new Date(),
      startedAt: new Date(),
      completedAt: new Date(),
      artifacts: { "thumbnail": "s3://..." }
    };
  }

  @Post()
  async requestTransformation(@Body() payload: any): Promise<{ jobId: string }> {
    const jobId = await this.transformationService.triggerTransformation(
      payload.mediaId,
      payload.tenantId,
      payload.profileId || 'default'
    );
    return { jobId };
  }

  @Post('retry')
  async retryFailedJob(@Body() payload: { jobId: string; tenantId: string }): Promise<{ status: string }> {
    if (!payload.jobId || !payload.tenantId) {
      throw new Error('jobId and tenantId are required');
    }
    // E.g., Move from DLQ back to main queue
    return { status: 'REQUEUED' };
  }
}
