import { Controller, Get, Post, Patch, Param, Body, Query, Headers } from '@nestjs/common';
import { 
  PromptCatalog,
  PromptStatistics,
  PromptHistory
} from '../../application/read-models';
import { PromptService, PromptApprovalService, PromptPublishingService } from '../../domain/services';

@Controller('ai/prompts')
export class EnterprisePromptController {
  constructor(
    private readonly promptService: PromptService,
    private readonly approvalService: PromptApprovalService,
    private readonly publishingService: PromptPublishingService
  ) {}

  @Get()
  async getPrompts(@Query('tenantId') tenantId: string): Promise<PromptCatalog[]> {
    if (!tenantId) throw new Error('tenantId is required');
    return [];
  }

  @Get('statistics')
  async getStatistics(@Query('tenantId') tenantId: string): Promise<PromptStatistics> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      totalPrompts: 45,
      publishedPrompts: 12,
      pendingApprovals: 3,
      mostUsedPromptId: 'prompt-42'
    };
  }

  @Get(':id')
  async getPrompt(@Param('id') id: string, @Query('tenantId') tenantId: string): Promise<PromptCatalog> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      promptId: id,
      name: 'System Default',
      description: 'Default system prompt for the platform',
      status: 'PUBLISHED',
      latestVersionId: 'v2',
      publishedVersionId: 'v2',
      type: 'SYSTEM',
      updatedAt: new Date()
    };
  }

  @Post()
  async createPrompt(
    @Query('tenantId') tenantId: string,
    @Body() payload: any
  ): Promise<{ promptId: string }> {
    if (!tenantId) throw new Error('tenantId is required');
    const promptId = await this.promptService.createPrompt(tenantId, payload.name, payload);
    return { promptId };
  }

  @Patch(':id')
  async updatePrompt(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
    @Body() payload: any
  ): Promise<{ status: string }> {
    if (!tenantId) throw new Error('tenantId is required');
    // Implement update logic here
    return { status: 'UPDATED' };
  }

  @Post(':id/review')
  async submitForReview(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
    @Body() payload: { versionId: string },
    @Headers('x-user-id') userId: string
  ): Promise<{ status: string }> {
    if (!tenantId || !userId) throw new Error('tenantId and userId are required');
    await this.approvalService.submitForReview(tenantId, id, payload.versionId, userId);
    return { status: 'REVIEW_SUBMITTED' };
  }

  @Post(':id/approve')
  async approvePrompt(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
    @Body() payload: { versionId: string },
    @Headers('x-user-id') approverId: string
  ): Promise<{ status: string }> {
    if (!tenantId || !approverId) throw new Error('tenantId and approverId are required');
    await this.approvalService.approve(tenantId, id, payload.versionId, approverId);
    return { status: 'APPROVED' };
  }

  @Post(':id/publish')
  async publishPrompt(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
    @Body() payload: { versionId: string }
  ): Promise<{ status: string }> {
    if (!tenantId) throw new Error('tenantId is required');
    await this.publishingService.publish(tenantId, id, payload.versionId);
    return { status: 'PUBLISHED' };
  }

  @Post(':id/rollback')
  async rollbackPrompt(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
    @Body() payload: { targetVersionId: string }
  ): Promise<{ status: string }> {
    if (!tenantId) throw new Error('tenantId is required');
    await this.publishingService.rollback(tenantId, id, payload.targetVersionId);
    return { status: 'ROLLED_BACK' };
  }
}
