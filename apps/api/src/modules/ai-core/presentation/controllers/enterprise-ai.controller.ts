import { Controller, Get, Post, Param, Body, Query, Headers } from '@nestjs/common';
import { 
  AiSessionService,
  ConversationService,
  AiExecutionService
} from '../../domain/services';
import { 
  AiSessionSummary,
  UsageStatistics,
  CostStatistics,
  AiPlatformHealth
} from '../../application/read-models';

@Controller('ai')
export class EnterpriseAiController {
  constructor(
    private readonly sessionService: AiSessionService,
    private readonly conversationService: ConversationService,
    private readonly executionService: AiExecutionService
  ) {}

  @Get('sessions')
  async getSessions(@Query('tenantId') tenantId: string): Promise<AiSessionSummary[]> {
    if (!tenantId) throw new Error('tenantId is required');
    return [];
  }

  @Get('sessions/:id')
  async getSession(
    @Param('id') sessionId: string,
    @Query('tenantId') tenantId: string
  ): Promise<AiSessionSummary> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      sessionId,
      userId: 'usr-1',
      status: 'RUNNING',
      startedAt: new Date(),
      lastActivityAt: new Date(),
      messageCount: 4
    };
  }

  @Post('sessions')
  async createSession(
    @Query('tenantId') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() payload: any
  ): Promise<{ sessionId: string }> {
    if (!tenantId || !userId) throw new Error('tenantId and userId are required');
    const sessionId = await this.sessionService.createSession(tenantId, userId, payload);
    return { sessionId };
  }

  @Post('execute')
  async execute(
    @Query('tenantId') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() payload: { sessionId: string; prompt: string; model: string }
  ): Promise<any> {
    if (!tenantId || !userId) throw new Error('tenantId and userId are required');
    
    await this.conversationService.addMessage(tenantId, payload.sessionId, { role: 'user', content: payload.prompt });
    const response = await this.executionService.execute(tenantId, payload.sessionId, payload.prompt, { modelId: payload.model });
    await this.conversationService.addMessage(tenantId, payload.sessionId, { role: 'assistant', content: response.text });
    
    return response;
  }

  @Get('usage')
  async getUsage(@Query('tenantId') tenantId: string): Promise<UsageStatistics> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      period: '2023-10',
      totalPromptTokens: 150000,
      totalCompletionTokens: 45000,
      totalExecutions: 1200,
      errorRate: 0.01
    };
  }

  @Get('costs')
  async getCosts(@Query('tenantId') tenantId: string): Promise<CostStatistics> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      period: '2023-10',
      totalCostUsd: 145.50,
      costByModel: {
        'gpt-4o': 120.00,
        'claude-3-haiku': 25.50
      }
    };
  }

  @Get('health')
  async getHealth(@Query('tenantId') tenantId: string): Promise<AiPlatformHealth> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      status: 'HEALTHY',
      activeSessions: 12,
      averageLatencyMs: 450,
      lastChecked: new Date()
    };
  }
}
