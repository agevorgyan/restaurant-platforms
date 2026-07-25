/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import {
  RuleService,
  RuleEvaluationService,
  SimulationService,
} from '../../application/services';
import {
  CreateRuleDto,
  UpdateRuleDto,
  PublishRuleDto,
  EvaluateRulesDto,
  SimulateRulesDto,
} from '../../application/dto';

@Controller('automation/rules')
export class RulesController {
  constructor(
    private readonly ruleService: RuleService,
    private readonly evaluationService: RuleEvaluationService,
    private readonly simulationService: SimulationService,
  ) {}

  @Get()
  async getRules() {
    return this.ruleService.getRules();
  }

  @Post()
  async createRule(@Body() dto: CreateRuleDto) {
    return this.ruleService.createRule(dto);
  }

  @Patch(':id')
  async updateRule(@Param('id') id: string, @Body() dto: UpdateRuleDto) {
    return this.ruleService.updateRule(id, dto);
  }

  @Post(':id/publish')
  async publishRule(@Param('id') id: string, @Body() dto: PublishRuleDto) {
    return this.ruleService.publishRule(id, dto);
  }

  @Post('evaluate')
  async evaluateRules(@Body() dto: EvaluateRulesDto) {
    return this.evaluationService.evaluateRules(dto);
  }

  @Post('simulate')
  async simulateRules(@Body() dto: SimulateRulesDto) {
    return this.simulationService.simulateRules(dto);
  }

  @Get('statistics')
  async getStatistics() {
    return this.ruleService.getStatistics();
  }
}
