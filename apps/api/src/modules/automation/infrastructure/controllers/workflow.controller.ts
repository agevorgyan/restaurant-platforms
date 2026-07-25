/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import {
  WorkflowService,
  WorkflowExecutionService,
} from '../../application/services';
import {
  CreateWorkflowDto,
  UpdateWorkflowDto,
  StartWorkflowDto,
  PublishWorkflowDto,
} from '../../application/dto';

@Controller('automation/workflows')
export class WorkflowController {
  constructor(
    private readonly workflowService: WorkflowService,
    private readonly executionService: WorkflowExecutionService,
  ) {}

  @Get()
  async getWorkflows() {
    return this.workflowService.getWorkflows();
  }

  @Post()
  async createWorkflow(@Body() dto: CreateWorkflowDto) {
    return this.workflowService.createWorkflow(dto);
  }

  @Patch(':id')
  async updateWorkflow(@Param('id') id: string, @Body() dto: UpdateWorkflowDto) {
    return this.workflowService.updateWorkflow(id, dto);
  }

  @Post(':id/publish')
  async publishWorkflow(@Param('id') id: string, @Body() dto: PublishWorkflowDto) {
    return this.workflowService.publishWorkflow(id, dto);
  }

  @Post(':id/start')
  async startWorkflow(@Param('id') id: string, @Body() dto: StartWorkflowDto) {
    return this.executionService.startWorkflowInstance(id, dto);
  }

  @Post(':id/cancel')
  async cancelWorkflow(@Param('id') id: string) {
    return this.executionService.cancelWorkflowInstance(id);
  }

  @Get('executions')
  async getExecutions() {
    return this.executionService.getExecutions();
  }

  @Get('statistics')
  async getStatistics() {
    return this.workflowService.getStatistics();
  }
}
