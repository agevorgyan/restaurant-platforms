import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { 
  WorkflowEngine,
  WorkflowMonitoringService,
  WorkflowRegistry
} from '../../application/services';
import { 
  WorkflowInstance,
  WorkflowMetrics,
  WorkflowDefinition
} from '../../application/read-models';

@Controller('workflows')
export class EnterpriseWorkflowController {
  constructor(
    private readonly engine: WorkflowEngine,
    private readonly monitoringService: WorkflowMonitoringService,
    private readonly registry: WorkflowRegistry
  ) {}

  @Get()
  async getInstances(): Promise<WorkflowInstance[]> {
    return this.engine.getAllInstances();
  }

  @Get('definitions')
  async getDefinitions(): Promise<WorkflowDefinition[]> {
    return this.registry.getAll();
  }

  @Get('statistics')
  async getStatistics(): Promise<WorkflowMetrics> {
    return this.monitoringService.getMetrics();
  }

  @Get(':id')
  async getWorkflow(@Param('id') id: string): Promise<WorkflowInstance | null> {
    const instance = this.engine.getInstance(id);
    return instance || null;
  }

  @Post('start')
  async startWorkflow(
    @Body() payload: { definitionId: string; tenantId: string; context: any }
  ): Promise<WorkflowInstance> {
    return this.engine.startWorkflow(payload.definitionId, payload.tenantId, payload.context);
  }

  @Post(':id/pause')
  async pauseWorkflow(@Param('id') id: string): Promise<{ status: string }> {
    await this.engine.pause(id);
    return { status: 'PAUSED' };
  }

  @Post(':id/resume')
  async resumeWorkflow(@Param('id') id: string): Promise<{ status: string }> {
    await this.engine.resume(id);
    return { status: 'RESUMED' };
  }

  @Post(':id/cancel')
  async cancelWorkflow(@Param('id') id: string): Promise<{ status: string }> {
    await this.engine.cancel(id);
    return { status: 'CANCELLED' };
  }
}
