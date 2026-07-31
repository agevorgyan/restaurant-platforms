/**
 * Enterprise Prompt Management Platform - REST Controller
 *
 * Exposes production REST API endpoints for prompt registration, version management,
 * variable extraction, approval workflows, evaluation testing, and publication.
 *
 * API Base Path: /ai/prompts
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EnterprisePromptPlatformService } from '../../application/services/prompt-platform.services';
import {
  CreatePromptDto,
  UpdatePromptDto,
  EvaluatePromptDto,
  ApprovePromptDto,
  PromptResponseDto,
} from '../../application/dto/prompt.dto';
import {
  PromptCatalog,
  PublishedPrompts,
  PromptHistory,
  EvaluationResults,
  ApprovalQueue,
} from '../../application/read-models/prompt.read-models';

@Controller('ai/prompts')
export class EnterprisePromptController {
  constructor(private readonly promptService: EnterprisePromptPlatformService) {}

  /**
   * GET /ai/prompts
   * Query prompt template catalog with optional type/status filters.
   */
  @Get()
  async getPrompts(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('type') type?: any,
    @Query('status') status?: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<PromptCatalog> {
    const tenantId = tenantHeader || undefined;
    return this.promptService.getPromptCatalog({
      tenantId,
      type,
      status,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }

  /**
   * GET /ai/prompts/history
   * Query historical prompt versions and state changes.
   */
  @Get('history')
  async getPromptHistory(): Promise<PromptHistory> {
    return this.promptService.getPromptHistory();
  }

  /**
   * POST /ai/prompts
   * Register a new prompt template version.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPrompt(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: CreatePromptDto
  ): Promise<PromptResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.promptService.createPrompt(tenantId, dto);
  }

  /**
   * PATCH /ai/prompts/:id
   * Update prompt template content or metadata.
   * Throws PublishedPromptImmutableException if prompt is in PUBLISHED state.
   */
  @Patch(':id')
  async updatePrompt(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: UpdatePromptDto
  ): Promise<PromptResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.promptService.updatePrompt(id, tenantId, dto);
  }

  /**
   * POST /ai/prompts/:id/review
   * Submit prompt for peer or governance review (DRAFT -> REVIEW).
   */
  @Post(':id/review')
  async submitForReview(
    @Param('id') id: string,
    @Body('submittedBy') submittedBy?: string
  ): Promise<PromptResponseDto> {
    const reviewer = submittedBy || 'author-user';
    return this.promptService.submitForReview(id, reviewer);
  }

  /**
   * POST /ai/prompts/:id/approve
   * Approve prompt for production deployment (REVIEW -> APPROVED).
   */
  @Post(':id/approve')
  async approvePrompt(
    @Param('id') id: string,
    @Body() dto: ApprovePromptDto
  ): Promise<PromptResponseDto> {
    const approvedBy = dto.approvedBy || 'admin-lead';
    return this.promptService.approvePrompt(id, approvedBy);
  }

  /**
   * POST /ai/prompts/:id/publish
   * Publish prompt for runtime execution by AI Gateway (APPROVED -> PUBLISHED).
   */
  @Post(':id/publish')
  async publishPrompt(@Param('id') id: string): Promise<PromptResponseDto> {
    return this.promptService.publishPrompt(id);
  }

  /**
   * POST /ai/prompts/:id/evaluate
   * Execute evaluation test cases against prompt template.
   */
  @Post(':id/evaluate')
  async evaluatePrompt(
    @Param('id') id: string,
    @Body() dto: EvaluatePromptDto
  ): Promise<EvaluationResults> {
    return this.promptService.evaluatePrompt(id, dto);
  }
}
