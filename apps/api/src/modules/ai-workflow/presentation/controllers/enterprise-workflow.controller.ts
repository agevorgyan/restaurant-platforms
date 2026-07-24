import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { 
  WorkflowExecutionHistory,
  WorkflowStatistics,
  RegisteredTools,
  WorkflowHealth
} from '../../application/read-models';
import { WorkflowService, WorkflowExecutionService, ToolRegistryService } from '../../domain/services';

@Controller('ai')
export class EnterpriseWorkflowController {
  constructor(
    private readonly workflowService: WorkflowService,
    private readonly executionService: WorkflowExecutionService,
    private readonly toolRegistry: ToolRegistryService
  ) {}

  // Workflows

  @Get('workflows')
  async getWorkflows(@Query('tenantId') tenantId: string): Promise<any[]> {
    if (!tenantId) throw new Error('tenantId is required');
    return [];
  }

  @Post('workflows')
  async defineWorkflow(
    @Query('tenantId') tenantId: string,
    @Body() payload: { definition: any }
  ): Promise<{ workflowId: string }> {
    if (!tenantId) throw new Error('tenantId is required');
    const workflowId = await this.workflowService.defineWorkflow(tenantId, payload.definition);
    return { workflowId };
  }

  @Post('workflows/:id/execute')
  async executeWorkflow(
    @Param('id') workflowId: string,
    @Query('tenantId') tenantId: string,
    @Body() payload: { context: any }
  ): Promise<{ executionId: string }> {
    if (!tenantId) throw new Error('tenantId is required');
    const executionId = await this.executionService.startExecution(tenantId, workflowId, payload.context);
    return { executionId };
  }

  @Post('workflows/:id/resume')
  async resumeWorkflow(
    @Param('id') executionId: string,
    @Query('tenantId') tenantId: string
  ): Promise<{ status: string }> {
    if (!tenantId) throw new Error('tenantId is required');
    await this.executionService.resumeExecution(tenantId, executionId);
    return { status: 'RESUMED' };
  }

  @Post('workflows/:id/cancel')
  async cancelWorkflow(
    @Param('id') executionId: string,
    @Query('tenantId') tenantId: string
  ): Promise<{ status: string }> {
    if (!tenantId) throw new Error('tenantId is required');
    return { status: 'CANCELLED' };
  }

  @Get('workflows/statistics')
  async getWorkflowStatistics(@Query('tenantId') tenantId: string): Promise<WorkflowStatistics> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      period: 'current-month',
      totalExecutions: 850,
      successfulExecutions: 830,
      failedExecutions: 20,
      averageDurationMs: 4500
    };
  }

  @Get('workflows/health')
  async getWorkflowHealth(@Query('tenantId') tenantId: string): Promise<WorkflowHealth> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      tenantId,
      activeExecutions: 15,
      suspendedExecutions: 3,
      failedExecutionsLastHour: 0,
      averageToolLatencyMs: 250
    };
  }

  @Get('workflows/:id')
  async getWorkflow(@Param('id') id: string, @Query('tenantId') tenantId: string): Promise<any> {
    if (!tenantId) throw new Error('tenantId is required');
    return {
      workflowId: id,
      tenantId,
      status: 'AVAILABLE'
    };
  }

  // Tools

  @Get('tools')
  async getTools(@Query('tenantId') tenantId: string): Promise<RegisteredTools> {
    return {
      tenantId: tenantId || 'GLOBAL',
      tools: []
    };
  }

  @Post('tools/register')
  async registerTool(
    @Body() payload: { toolDef: any }
  ): Promise<{ toolId: string }> {
    const toolId = await this.toolRegistry.registerTool(payload.toolDef);
    return { toolId };
  }

  @Get('tools/:id')
  async getTool(@Param('id') id: string): Promise<any> {
    return {
      toolId: id,
      status: 'AVAILABLE'
    };
  }
}
