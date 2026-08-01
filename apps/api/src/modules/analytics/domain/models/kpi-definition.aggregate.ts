/**
 * Enterprise KPI Platform - KPI Definition Aggregate Root
 *
 * Manages KPI definitions, deterministic formula evaluation, threshold status transitions,
 * weighted scorecard weights, and append-only historical KpiSnapshots.
 */

import { KpiType, TargetType, KpiStatus, ThresholdStatus } from '../enums/kpi.enums';
import {
  KpiId,
  KpiName,
  KpiFormula,
  KpiTarget,
  KpiThreshold,
  KpiScore,
  KpiSnapshot,
} from '../value-objects/kpi-vo';
import { BaseAnalyticsDomainEvent } from '../events/analytics.events';
import {
  KpiCreatedEvent,
  KpiCalculatedEvent,
  TargetExceededEvent,
  ThresholdCrossedEvent,
  ScoreUpdatedEvent,
  KpiArchivedEvent,
} from '../events/kpi.events';

export interface KpiDefinitionProps {
  id: KpiId;
  tenantId: string;
  name: KpiName;
  description: string;
  kpiType: KpiType;
  formula: KpiFormula;
  target: KpiTarget;
  threshold: KpiThreshold;
  weight: number;
  department: string;
  status: KpiStatus;
  lastScore?: KpiScore;
  snapshots: KpiSnapshot[];
  createdAt: Date;
  updatedAt: Date;
}

export class KpiDefinitionAggregate {
  private domainEvents: BaseAnalyticsDomainEvent[] = [];

  private constructor(private props: KpiDefinitionProps) {}

  public static create(params: {
    id?: KpiId;
    tenantId?: string;
    name: string;
    description: string;
    kpiType?: KpiType;
    formula: string;
    targetValue: number;
    targetType?: TargetType;
    excellentMin?: number;
    goodMin?: number;
    warningMin?: number;
    weight?: number;
    department?: string;
  }): KpiDefinitionAggregate {
    const id = params.id || KpiId.generate();
    const tenantId = params.tenantId || 'tenant-default';
    const kpiType = params.kpiType || KpiType.SALES_KPI;
    const formula = KpiFormula.create(params.formula);
    const target = KpiTarget.create(params.targetValue, params.targetType || TargetType.STATIC_TARGET);

    const exc = params.excellentMin ?? params.targetValue * 0.95;
    const good = params.goodMin ?? params.targetValue * 0.85;
    const warn = params.warningMin ?? params.targetValue * 0.70;
    const threshold = KpiThreshold.create(exc, good, warn);

    const now = new Date();
    const aggregate = new KpiDefinitionAggregate({
      id,
      tenantId,
      name: KpiName.create(params.name),
      description: params.description,
      kpiType,
      formula,
      target,
      threshold,
      weight: params.weight ?? 1.0,
      department: params.department || 'General',
      status: KpiStatus.DRAFT,
      snapshots: [],
      createdAt: now,
      updatedAt: now,
    });

    aggregate.addDomainEvent(
      new KpiCreatedEvent(id.getValue(), tenantId, params.name, kpiType, now)
    );

    return aggregate;
  }

  // --- Getters ---
  public getId(): KpiId { return this.props.id; }
  public getTenantId(): string { return this.props.tenantId; }
  public getName(): KpiName { return this.props.name; }
  public getDescription(): string { return this.props.description; }
  public getKpiType(): KpiType { return this.props.kpiType; }
  public getFormula(): KpiFormula { return this.props.formula; }
  public getTarget(): KpiTarget { return this.props.target; }
  public getThreshold(): KpiThreshold { return this.props.threshold; }
  public getWeight(): number { return this.props.weight; }
  public getDepartment(): string { return this.props.department; }
  public getStatus(): KpiStatus { return this.props.status; }
  public getLastScore(): KpiScore | undefined { return this.props.lastScore; }
  public getSnapshots(): KpiSnapshot[] { return [...this.props.snapshots]; }
  public getCreatedAt(): Date { return this.props.createdAt; }
  public getUpdatedAt(): Date { return this.props.updatedAt; }

  public getUncommittedEvents(): BaseAnalyticsDomainEvent[] { return [...this.domainEvents]; }
  public clearEvents(): void { this.domainEvents = []; }

  private addDomainEvent(event: BaseAnalyticsDomainEvent): void { this.domainEvents.push(event); }

  public activate(): void {
    this.props.status = KpiStatus.ACTIVE;
    this.props.updatedAt = new Date();
  }

  public calculate(variables: Record<string, number>): KpiScore {
    const rawValue = this.props.formula.evaluate(variables);
    const score = KpiScore.calculate(rawValue, this.props.target.targetValue, this.props.threshold);

    const prevStatus = this.props.lastScore?.status;
    this.props.lastScore = score;
    this.props.updatedAt = new Date();

    // Create append-only snapshot
    const snapshot = KpiSnapshot.create(this.getId().getValue(), score);
    this.props.snapshots.push(snapshot);

    this.addDomainEvent(
      new KpiCalculatedEvent(this.getId().getValue(), this.getTenantId(), score.calculatedValue, score.status, new Date())
    );

    if (prevStatus && prevStatus !== score.status) {
      this.addDomainEvent(
        new ThresholdCrossedEvent(this.getId().getValue(), this.getTenantId(), prevStatus, score.status, new Date())
      );
    }

    if (score.calculatedValue >= this.props.target.targetValue) {
      this.addDomainEvent(
        new TargetExceededEvent(this.getId().getValue(), this.getTenantId(), this.props.target.targetValue, score.calculatedValue, new Date())
      );
    }

    return score;
  }

  public archive(): void {
    this.props.status = KpiStatus.ARCHIVED;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new KpiArchivedEvent(this.getId().getValue(), this.getTenantId(), new Date())
    );
  }
}
