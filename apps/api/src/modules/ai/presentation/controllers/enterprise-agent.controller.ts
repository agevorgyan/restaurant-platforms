/**
 * Enterprise AI Agent Platform - REST Controller
 *
 * Exposes production REST API endpoints for agent registration, goal decomposition,
 * execution loop, human approval gates, state pausing/resuming, and audit history.
 *
 * API Base Path: /ai/agents
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EnterpriseAgentPlatformService } from '../../application/services/agent-platform.services';
import { CreateAgentDto, ExecuteGoalDto, AgentResponseDto } from '../../application/dto/agent.dto';
import {
  AgentCatalog,
  ExecutionHistory,
  AgentStatistics,
} from '../../application/read-models/agent.read-models';

@Controller('ai/agents')
export class EnterpriseAgentController {
  constructor(private readonly agentService: EnterpriseAgentPlatformService) {}

  /**
   * GET /ai/agents
   * Query catalog of registered AI agents.
   */
  @Get()
  async getAgents(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<AgentCatalog> {
    const tenantId = tenantHeader || undefined;
    return this.agentService.getAgentCatalog(tenantId);
  }

  /**
   * GET /ai/agents/history
   * Query audit trail of goal execution sessions.
   */
  @Get('history')
  async getExecutionHistory(): Promise<ExecutionHistory> {
    return this.agentService.getExecutionHistory();
  }

  /**
   * GET /ai/agents/statistics
   * Query agent execution metrics and step success rates.
   */
  @Get('statistics')
  async getAgentStatistics(): Promise<AgentStatistics> {
    return this.agentService.getAgentStatistics();
  }

  /**
   * POST /ai/agents
   * Register a new AI Agent instance.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAgent(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: CreateAgentDto
  ): Promise<AgentResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.agentService.createAgent(tenantId, dto);
  }

  /**
   * POST /ai/agents/execute
   * Assign goal to agent and execute multi-step plan.
   * If step requires approval, pauses execution into WAITING_APPROVAL state.
   */
  @Post('execute')
  @HttpCode(HttpStatus.OK)
  async executeGoal(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: ExecuteGoalDto
  ): Promise<AgentResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.agentService.executeGoal(tenantId, dto);
  }

  /**
   * POST /ai/agents/:id/pause
   * Pause agent execution state.
   */
  @Post(':id/pause')
  async pauseAgent(@Param('id') id: string): Promise<AgentResponseDto> {
    return this.agentService.pauseAgent(id);
  }

  /**
   * POST /ai/agents/:id/resume
   * Resume agent execution from the latest checkpoint.
   */
  @Post(':id/resume')
  async resumeAgent(@Param('id') id: string): Promise<AgentResponseDto> {
    return this.agentService.resumeAgent(id);
  }
}
