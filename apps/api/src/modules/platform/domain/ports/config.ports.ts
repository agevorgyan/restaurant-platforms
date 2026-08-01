/**
 * Enterprise Distributed Configuration Platform - Domain Ports (Interfaces)
 *
 * Hexagonal architecture ports for configuration persistence, CQRS read queries,
 * snapshot management, and pluggable runtime distribution providers.
 */

import { ConfigurationAggregate } from '../models/config.aggregate';
import { ConfigurationType, EnvironmentType, ConfigurationStatus } from '../enums/config.enums';
import { ConfigurationSnapshot } from '../value-objects/config-vo';
import {
  ConfigurationCatalogReadModel,
  ConfigurationHistoryReadModel,
  ConfigurationStatisticsReadModel,
  EnvironmentCatalogReadModel,
  PropagationHistoryReadModel,
  SnapshotHistoryReadModel,
} from '../../application/read-models/config.read-models';

export const CONFIGURATION_REPOSITORY_TOKEN = Symbol('IConfigurationRepository');
export const CONFIGURATION_QUERY_REPOSITORY_TOKEN = Symbol('IConfigurationQueryRepository');
export const CONFIGURATION_PROVIDER_TOKEN = Symbol('IConfigurationProviderPort');

export interface IConfigurationRepository {
  save(config: ConfigurationAggregate): Promise<void>;
  findById(id: string, tenantId?: string): Promise<ConfigurationAggregate | null>;
  findByKey(key: string, environment: EnvironmentType, tenantId?: string): Promise<ConfigurationAggregate | null>;
  findByTenant(
    tenantId: string,
    environment?: EnvironmentType,
    configType?: ConfigurationType,
    status?: ConfigurationStatus
  ): Promise<ConfigurationAggregate[]>;
  delete(id: string, tenantId: string): Promise<boolean>;
}

export interface IConfigurationQueryRepository {
  getCatalog(
    tenantId?: string,
    environment?: EnvironmentType,
    configType?: ConfigurationType,
    status?: ConfigurationStatus
  ): Promise<ConfigurationCatalogReadModel>;

  getEnvironmentCatalog(tenantId?: string): Promise<EnvironmentCatalogReadModel>;

  getConfigurationHistory(tenantId?: string, key?: string): Promise<ConfigurationHistoryReadModel>;

  getPropagationHistory(tenantId?: string): Promise<PropagationHistoryReadModel>;

  getStatistics(tenantId?: string): Promise<ConfigurationStatisticsReadModel>;

  getSnapshotHistory(tenantId?: string, environment?: EnvironmentType): Promise<SnapshotHistoryReadModel>;

  saveSnapshot(tenantId: string, snapshot: ConfigurationSnapshot): Promise<ConfigurationSnapshot>;
}

export interface IConfigurationProviderPort {
  publishAndPropagate(
    configuration: ConfigurationAggregate,
    targetEnvironment: EnvironmentType
  ): Promise<{ propagated: boolean; latencyMs: number }>;
}
