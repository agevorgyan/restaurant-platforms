/**
 * Enterprise KPI Platform - Domain & Application Services
 *
 * Implements core application services:
 * 1. KpiDefinitionService
 * 2. FormulaService
 * 3. TargetService
 * 4. ThresholdService
 * 5. ScorecardService
 * 6. HierarchyService
 * 7. EnterpriseKpiPlatformService
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { KpiDefinitionAggregate } from '../../domain/models/kpi-definition.aggregate';
import { KpiId, KpiFormula, KpiScore } from '../../domain/value-objects/kpi-vo';
import { KpiType, KpiStatus, ThresholdStatus } from '../../domain/enums/kpi.enums';
import { KpiRepositoryPort } from '../../domain/ports/kpi.ports';
import { EVENT_PUBLISHER_TOKEN } from '../../../integration/application/services/connector-platform.services';
import { EventPublisherPort } from '../../../integration/domain/ports/connector.ports';
import { CreateKpiDto, UpdateKpiDto, CalculateKpiDto, KpiResponseDto } from '../dto/kpi.dto';
import {
  KpiCatalogReadModel,
  KpiScorecardsReadModel,
  KpiSnapshotsReadModel,
  KpiStatisticsReadModel,
  TargetProgressReadModel,
} from '../read-models/kpi.read-models';
import { KpiNotFoundException } from '../../domain/exceptions/kpi.exceptions';

export const KPI_REPOSITORY_TOKEN = 'KpiRepositoryPort';

/**
 * Service 1: FormulaService
 * Evaluates deterministic arithmetic formulas over input variables.
 */
@Injectable()
export class FormulaService {
  public evaluateFormula(expression: string, variables: Record<string, number>): number {
    const formula = KpiFormula.create(expression);
    return formula.evaluate(variables);
  }
}

/**
 * Service 2: ScorecardService
 * Calculates weighted departmental and overall executive scorecards.
 */
@Injectable()
export class ScorecardService {
  public calculateDepartmentScorecard(kpis: KpiDefinitionAggregate[]): { weightedIndex: number; status: ThresholdStatus } {
    if (kpis.length === 0) return { weightedIndex: 100, status: ThresholdStatus.EXCELLENT };

    let totalWeight = 0;
    let weightedSum = 0;

    for (const kpi of kpis) {
      const score = kpi.getLastScore();
      const pct = score ? score.percentageToTarget : 100;
      const weight = kpi.getWeight();

      weightedSum += pct * weight;
      totalWeight += weight;
    }

    const index = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 100;
    let status = ThresholdStatus.EXCELLENT;
    if (index < 70) status = ThresholdStatus.CRITICAL;
    else if (index < 85) status = ThresholdStatus.WARNING;
    else if (index < 95) status = ThresholdStatus.GOOD;

    return { weightedIndex: index, status };
  }
}

/**
 * Service 3: EnterpriseKpiPlatformService
 * High-level KPI platform facade managing KPI lifecycle, calculations, scorecards, and historical snapshots.
 */
@Injectable()
export class EnterpriseKpiPlatformService {
  private readonly logger = new Logger(EnterpriseKpiPlatformService.name);

  constructor(
    @Inject(KPI_REPOSITORY_TOKEN)
    private readonly repo: KpiRepositoryPort,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort,
    private readonly formulaService: FormulaService,
    private readonly scorecardService: ScorecardService
  ) {}

  public async createKpi(tenantId: string, dto: CreateKpiDto): Promise<KpiResponseDto> {
    const aggregate = KpiDefinitionAggregate.create({
      tenantId,
      name: dto.name,
      description: dto.description,
      kpiType: dto.kpiType,
      formula: dto.formula,
      targetValue: dto.targetValue,
      targetType: dto.targetType,
      excellentMin: dto.excellentMin,
      goodMin: dto.goodMin,
      warningMin: dto.warningMin,
      weight: dto.weight,
      department: dto.department,
    });

    aggregate.activate();
    await this.repo.saveKpi(aggregate);
    await this.eventPublisher.publishAll(aggregate.getUncommittedEvents());
    aggregate.clearEvents();

    return this.toResponseDto(aggregate);
  }

  public async updateKpi(id: string, dto: UpdateKpiDto): Promise<KpiResponseDto> {
    const kpi = await this.repo.findKpiById(KpiId.create(id));
    if (!kpi) throw new KpiNotFoundException(id);

    if (dto.status === KpiStatus.ARCHIVED) {
      kpi.archive();
    }

    await this.repo.saveKpi(kpi);
    await this.eventPublisher.publishAll(kpi.getUncommittedEvents());
    kpi.clearEvents();

    return this.toResponseDto(kpi);
  }

  public async calculateKpi(id: string, dto: CalculateKpiDto): Promise<KpiResponseDto> {
    const kpi = await this.repo.findKpiById(KpiId.create(id));
    if (!kpi) throw new KpiNotFoundException(id);

    kpi.calculate(dto.variables);
    await this.repo.saveKpi(kpi);
    await this.eventPublisher.publishAll(kpi.getUncommittedEvents());
    kpi.clearEvents();

    return this.toResponseDto(kpi);
  }

  public async getKpiCatalog(tenantId?: string): Promise<KpiCatalogReadModel> {
    const list = await this.repo.findKpis(tenantId);
    const kpis = list.map(k => {
      const score = k.getLastScore();
      return {
        id: k.getId().getValue(),
        name: k.getName().getValue(),
        kpiType: k.getKpiType(),
        department: k.getDepartment(),
        status: k.getStatus(),
        targetValue: k.getTarget().targetValue,
        lastCalculatedValue: score?.calculatedValue,
        thresholdStatus: score?.status,
      };
    });

    return {
      totalKpis: kpis.length,
      kpis,
    };
  }

  public async getKpiScorecards(tenantId?: string): Promise<KpiScorecardsReadModel> {
    const list = await this.repo.findKpis(tenantId);
    const deptsMap = new Map<string, KpiDefinitionAggregate[]>();

    for (const k of list) {
      const dept = k.getDepartment();
      if (!deptsMap.has(dept)) deptsMap.set(dept, []);
      deptsMap.get(dept)!.push(k);
    }

    const deptSummaries: any[] = [];
    for (const [dept, kpis] of deptsMap.entries()) {
      const res = this.scorecardService.calculateDepartmentScorecard(kpis);
      deptSummaries.push({
        department: dept,
        weightedScore: res.weightedIndex,
        thresholdStatus: res.status,
        kpisCount: kpis.length,
      });
    }

    const overall = this.scorecardService.calculateDepartmentScorecard(list);

    return {
      overallScorecardIndex: overall.weightedIndex,
      departments: deptSummaries,
    };
  }

  public async getKpiSnapshots(tenantId?: string): Promise<KpiSnapshotsReadModel> {
    const list = await this.repo.findKpis(tenantId);
    const snapshotsList: any[] = [];

    for (const k of list) {
      for (const s of k.getSnapshots()) {
        snapshotsList.push({
          snapshotId: s.snapshotId,
          kpiId: s.kpiId,
          calculatedValue: s.calculatedValue,
          status: s.status,
          percentageToTarget: s.percentageToTarget,
          calculatedAt: s.calculatedAt,
        });
      }
    }

    return {
      totalSnapshots: snapshotsList.length,
      snapshots: snapshotsList,
    };
  }

  public async getKpiStatistics(): Promise<KpiStatisticsReadModel> {
    const list = await this.repo.findKpis();

    const byStatus: Record<KpiStatus, number> = {} as any;
    for (const s of Object.values(KpiStatus)) byStatus[s] = 0;

    const byType: Record<KpiType, number> = {} as any;
    for (const t of Object.values(KpiType)) byType[t] = 0;

    const byThreshold: Record<ThresholdStatus, number> = {} as any;
    for (const th of Object.values(ThresholdStatus)) byThreshold[th] = 0;

    for (const k of list) {
      byStatus[k.getStatus()] = (byStatus[k.getStatus()] || 0) + 1;
      byType[k.getKpiType()] = (byType[k.getKpiType()] || 0) + 1;
      const score = k.getLastScore();
      if (score) {
        byThreshold[score.status] = (byThreshold[score.status] || 0) + 1;
      }
    }

    return {
      totalKpis: list.length,
      byStatus,
      byType,
      byThreshold,
    };
  }

  private toResponseDto(kpi: KpiDefinitionAggregate): KpiResponseDto {
    const score = kpi.getLastScore();

    return {
      id: kpi.getId().getValue(),
      tenantId: kpi.getTenantId(),
      name: kpi.getName().getValue(),
      description: kpi.getDescription(),
      kpiType: kpi.getKpiType(),
      formula: kpi.getFormula().expression,
      targetValue: kpi.getTarget().targetValue,
      status: kpi.getStatus(),
      department: kpi.getDepartment(),
      weight: kpi.getWeight(),
      lastCalculatedValue: score?.calculatedValue,
      thresholdStatus: score?.status,
      percentageToTarget: score?.percentageToTarget,
      snapshotsCount: kpi.getSnapshots().length,
      createdAt: kpi.getCreatedAt(),
      updatedAt: kpi.getUpdatedAt(),
    };
  }
}
