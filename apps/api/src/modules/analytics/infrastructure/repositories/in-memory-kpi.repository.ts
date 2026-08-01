/**
 * Enterprise KPI Platform - In-Memory Repository
 */

import { Injectable } from '@nestjs/common';
import { KpiDefinitionAggregate } from '../../domain/models/kpi-definition.aggregate';
import { KpiId } from '../../domain/value-objects/kpi-vo';
import { KpiType, KpiStatus } from '../../domain/enums/kpi.enums';
import { KpiRepositoryPort } from '../../domain/ports/kpi.ports';

@Injectable()
export class InMemoryKpiRepository implements KpiRepositoryPort {
  private readonly store = new Map<string, KpiDefinitionAggregate>();

  public async saveKpi(kpi: KpiDefinitionAggregate): Promise<void> {
    this.store.set(kpi.getId().getValue(), kpi);
  }

  public async findKpiById(id: KpiId): Promise<KpiDefinitionAggregate | null> {
    return this.store.get(id.getValue()) || null;
  }

  public async findKpis(tenantId?: string, filters?: { type?: KpiType; status?: KpiStatus; department?: string }): Promise<KpiDefinitionAggregate[]> {
    let result = Array.from(this.store.values());

    if (tenantId) {
      result = result.filter(k => k.getTenantId() === tenantId);
    }

    if (filters?.type) {
      result = result.filter(k => k.getKpiType() === filters.type);
    }

    if (filters?.status) {
      result = result.filter(k => k.getStatus() === filters.status);
    }

    if (filters?.department) {
      result = result.filter(k => k.getDepartment().toLowerCase() === filters.department?.toLowerCase());
    }

    return result;
  }

  public clear(): void {
    this.store.clear();
  }
}
