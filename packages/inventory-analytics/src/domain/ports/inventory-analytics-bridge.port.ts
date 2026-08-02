/**
 * Enterprise Inventory Analytics Platform - Inventory Analytics Bridge Port Interface
 *
 * Hexagonal Architecture Port interface for consuming core analytics platform infrastructure.
 */

import { MetricSnapshot } from '../value-objects/inventory-analytics-vo';

export interface InventoryAnalyticsBridgePort {
  ingestInventorySnapshot(snapshot: MetricSnapshot): Promise<boolean>;
  queryInventoryTimeSeries(metricName: string, window: string): Promise<Array<{ timestamp: string; value: number }>>;
}
