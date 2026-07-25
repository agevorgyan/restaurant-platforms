/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {
  ThreatDetectionService,
  IncidentService,
  AlertService,
  RuleEngineService,
} from '../../application/services';
import {
  CreateDetectionRuleDto,
  ResolveIncidentDto,
  ThreatSearchDto,
} from '../../application/dto';

@Controller('security')
export class ThreatController {
  constructor(
    private readonly threatDetectionService: ThreatDetectionService,
    private readonly incidentService: IncidentService,
    private readonly alertService: AlertService,
    private readonly ruleEngineService: RuleEngineService,
  ) {}

  /** GET /security/threats — Returns all detected threat records. */
  @Get('threats')
  async getThreats() {
    return this.threatDetectionService.getThreats();
  }

  /** GET /security/threats/statistics — Returns aggregated attack statistics. */
  @Get('threats/statistics')
  async getThreatStatistics() {
    return this.threatDetectionService.getThreatStatistics();
  }

  /** GET /security/incidents — Returns all security incidents. */
  @Get('incidents')
  async getIncidents() {
    return this.incidentService.getIncidents();
  }

  /** GET /security/incidents/:id — Returns a single incident with timeline. */
  @Get('incidents/:id')
  async getIncident(@Param('id') id: string) {
    return this.incidentService.getIncident(id);
  }

  /** POST /security/incidents/:id/resolve — Resolves an active incident. */
  @Post('incidents/:id/resolve')
  async resolveIncident(
    @Param('id') id: string,
    @Body() dto: ResolveIncidentDto,
  ) {
    return this.incidentService.resolveIncident(id, dto);
  }

  /** GET /security/alerts — Returns all active alerts. */
  @Get('alerts')
  async getAlerts() {
    return this.alertService.getAlerts();
  }

  /** POST /security/detection/rules — Creates a new detection rule in the rule engine. */
  @Post('detection/rules')
  async createDetectionRule(@Body() dto: CreateDetectionRuleDto) {
    return this.ruleEngineService.createRule(dto);
  }
}
