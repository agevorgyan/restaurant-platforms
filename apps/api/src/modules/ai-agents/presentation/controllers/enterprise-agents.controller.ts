import { Controller, Get, Post, Param, Body, Query, Headers } from '@nestjs/common';
import { 
  AgentExecutionHistory,
  AgentUsageStatistics,
  AgentHealth
} from '../../application/read-models';
import { AgentService, ExecutionService, ApprovalService } from '../../domain/services';

@Controller('ai/agents')
export class EnterpriseAiAgentsController {
  constructor(
    private readonly agentService: AgentService,
    private readonly executionService: ExecutionService,
    private readonly approvalService: ApprovalService
  ) {}

  @Get()
  async getAgents(@Query('tenantId') tenantId: string): Promise<any[]> {
    if (!tenantId) throw new Error('tenantId is required');
    return [];
  }

  @Post()
  async createAgent(
    @Query('tenantId') tenantId: string,
    @Body() payload: { type: string }
  ): Promise<{ agentId: string }> {
    if (!tenantId) throw new Error('tenantId is required');
    const agentId = await this.agentService.createAgent(tenantId, payload.type);
    return { agentId };
  }

  @Get('statistics')
  async getStatistics(@Query('tenantId') tenantId: string): Promise<AgentUsageStatistics> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      period: 'current-month',
      totalExecutions: 1500,
      totalToolsInvoked: 4500,
      totalApprovalsRequested: 12
    };
  }

  @Get('health')
  async getHealth(@Query('tenantId') tenantId: string): Promise<AgentHealth> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      activeAgents: 5,
      idleAgents: 2,
      failedExecutionsLastHour: 0
    };
  }

  @Get(':id')
  async getAgent(@Param('id') id: string, @Query('tenantId') tenantId: string): Promise<any> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      agentId: id,
      tenantId,
      type: 'Customer Support Agent',
      status: 'IDLE'
    };
  }

  @Post(':id/execute')
  async executeGoal(
    @Param('id') agentId: string,
    @Query('tenantId') tenantId: string,
    @Body() payload: { goal: string }
  ): Promise<{ executionId: string }> {
    if (!tenantId) throw new Error('tenantId is required');
    const executionId = await this.executionService.executeGoal(tenantId, agentId, payload.goal);
    return { executionId };
  }

  @Post(':id/approve')
  async approveExecution(
    @Param('id') agentId: string,
    @Query('tenantId') tenantId: string,
    @Body() payload: { executionId: string; approved: boolean },
    @Headers('x-user-id') userId: string
  ): Promise<{ status: string }> {
    if (!tenantId || !userId) throw new Error('tenantId and userId are required');
    await this.approvalService.processApproval(tenantId, payload.executionId, payload.approved, userId);
    return { status: 'PROCESSED' };
  }

  @Post(':id/cancel')
  async cancelExecution(
    @Param('id') agentId: string,
    @Query('tenantId') tenantId: string,
    @Body() payload: { executionId: string }
  ): Promise<{ status: string }> {
    if (!tenantId) throw new Error('tenantId is required');
    // Implement cancellation logic
    return { status: 'CANCELLED' };
  }
}
