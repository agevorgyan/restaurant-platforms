import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AssetProcessingService } from '../../domain/services';
import { AssetReference } from '../../domain/value-objects';
import { 
  ProcessingJob, 
  ProcessingStatistics,
  PipelineHealth 
} from '../../application/read-models';

@Controller('documents/processing')
export class EnterpriseProcessingController {
  constructor(private readonly processingService: AssetProcessingService) {}

  @Get()
  async getJobs(@Query('tenantId') tenantId: string): Promise<ProcessingJob[]> {
    if (!tenantId) throw new Error('tenantId is required');
    return []; // Mock list
  }

  @Get('statistics')
  async getStatistics(@Query('tenantId') tenantId: string): Promise<ProcessingStatistics> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      totalJobs: 15200,
      completedJobs: 15150,
      failedJobs: 50,
      averageProcessingTimeMs: 1200,
      period: new Date().toISOString().slice(0, 7)
    };
  }

  @Get('health')
  async getHealth(): Promise<PipelineHealth> {
    return {
      queueLength: 15,
      activeWorkers: 8,
      errorRate: 0.3,
      status: 'HEALTHY'
    };
  }

  @Get(':id')
  async getJob(@Param('id') id: string): Promise<ProcessingJob> {
    // Mock response
    return {
      jobId: id,
      documentId: 'doc-123',
      tenantId: 'tenant-1',
      status: 'COMPLETED',
      pipeline: ['VIRUS_SCAN', 'METADATA', 'IMAGE'],
      progressPercentage: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  @Post('retry')
  async retryJob(@Body() payload: { jobId: string, documentId: string, tenantId: string }): Promise<{ newJobId: string }> {
    // In a real scenario, fetch the asset details from the documentId
    const assetRef = AssetReference.create({
      documentId: payload.documentId,
      tenantId: payload.tenantId,
      mimeType: 'image/jpeg',
      sizeBytes: 1024 * 500
    }).toValue();

    const newJobId = await this.processingService.initiateProcessing(assetRef);
    return { newJobId };
  }
}
