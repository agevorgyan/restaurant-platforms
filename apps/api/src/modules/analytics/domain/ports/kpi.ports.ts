/**
 * Enterprise KPI Platform - Hexagonal Domain Ports
 */

import { KpiDefinitionAggregate } from '../models/kpi-definition.aggregate';
import { KpiId } from '../value-objects/kpi-vo';
import { KpiType, KpiStatus } from '../enums/kpi.enums';

export interface KpiRepositoryPort {
  saveKpi(kpi: KpiDefinitionAggregate): Promise<void>;
  findKpiById(id: KpiId): Promise<KpiDefinitionAggregate | null>;
  findKpis(tenantId?: string, filters?: { type?: KpiType; status?: KpiStatus; department?: string }): Promise<KpiDefinitionAggregate[]>;
}
