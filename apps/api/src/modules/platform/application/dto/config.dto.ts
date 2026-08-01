/**
 * Enterprise Distributed Configuration Platform - Data Transfer Objects (DTOs)
 *
 * Command and Query DTOs for REST presentation layer validation.
 */

import {
  ConfigurationStatus,
  ConfigurationType,
  EnvironmentType,
  PropagationStatus,
} from '../../domain/enums/config.enums';

export interface CreateConfigurationDto {
  key: string;
  value: unknown;
  configType: ConfigurationType;
  environment: EnvironmentType;
  namespace?: string;
  schema?: Record<string, unknown>;
  description?: string;
  tags?: string[];
}

export interface UpdateConfigurationDto {
  value: unknown;
  description?: string;
  tags?: string[];
}

export interface PublishConfigurationDto {
  targetEnvironment?: EnvironmentType;
}

export interface RollbackConfigurationDto {
  targetVersion: string;
  reason?: string;
}

export interface ConfigurationResponseDto {
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

export interface EnvironmentResponseDto {
  environment: EnvironmentType;
  totalConfigurations: number;
  publishedCount: number;
  draftCount: number;
  lastSnapshotAt?: string;
}

export interface PropagationResponseDto {
  configId: string;
  key: string;
  environment: EnvironmentType;
  status: PropagationStatus;
  latencyMs: number;
  timestamp: string;
}

export interface SnapshotResponseDto {
  snapshotId: string;
  tenantId: string;
  environment: EnvironmentType;
  keysCount: number;
  snapshotHash: string;
  createdAt: string;
}
