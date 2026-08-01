/**
 * Enterprise Distributed Configuration Platform - Read Models (CQRS Queries)
 *
 * Strongly-typed read projections for configuration catalog, environment catalog, version history,
 * propagation telemetry, configuration statistics, and snapshot logs.
 */

import {
  ConfigurationStatus,
  ConfigurationType,
  EnvironmentType,
  PropagationStatus,
} from '../../domain/enums/config.enums';

export interface ConfigurationSummaryReadModel {
  id: string;
  tenantId: string;
  key: string;
  value: unknown;
  namespace: string;
  configType: ConfigurationType;
  environment: EnvironmentType;
  status: ConfigurationStatus;
  propagationStatus: PropagationStatus;
  version: string;
  revision: number;
  checksum: string;
  signature?: string;
  description?: string;
  tags: string[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConfigurationCatalogReadModel {
  tenantId?: string;
  totalConfigurations: number;
  configurations: ConfigurationSummaryReadModel[];
}

export interface EnvironmentSummaryReadModel {
  environment: EnvironmentType;
  totalConfigurations: number;
  publishedCount: number;
  draftCount: number;
  lastSnapshotAt?: string;
}

export interface EnvironmentCatalogReadModel {
  tenantId?: string;
  environments: EnvironmentSummaryReadModel[];
}

export interface ConfigurationHistoryItem {
  id: string;
  key: string;
  version: string;
  revision: number;
  status: ConfigurationStatus;
  value: unknown;
  checksum: string;
  updatedBy: string;
  timestamp: string;
}

export interface ConfigurationHistoryReadModel {
  tenantId?: string;
  key?: string;
  totalRevisions: number;
  history: ConfigurationHistoryItem[];
}

export interface PropagationLogEntry {
  logId: string;
  configId: string;
  key: string;
  tenantId: string;
  environment: EnvironmentType;
  status: PropagationStatus;
  latencyMs: number;
  timestamp: string;
}

export interface PropagationHistoryReadModel {
  tenantId?: string;
  totalPropagations: number;
  averageLatencyMs: number;
  successfulCount: number;
  failedCount: number;
  logs: PropagationLogEntry[];
}

export interface ConfigurationStatisticsReadModel {
  tenantId?: string;
  totalConfigurations: number;
  byStatus: Record<ConfigurationStatus, number>;
  byType: Record<ConfigurationType, number>;
  byEnvironment: Record<EnvironmentType, number>;
  overallIntegrityHash: string;
}

export interface SnapshotLogEntry {
  snapshotId: string;
  tenantId: string;
  environment: EnvironmentType;
  keysCount: number;
  snapshotHash: string;
  createdAt: string;
}

export interface SnapshotHistoryReadModel {
  tenantId?: string;
  totalSnapshots: number;
  snapshots: SnapshotLogEntry[];
}
