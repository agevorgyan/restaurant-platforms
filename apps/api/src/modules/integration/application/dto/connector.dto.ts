/**
 * Enterprise Connector Platform - Application DTOs
 */

import { ConnectorType, ConnectorStatus, ConnectorCapability } from '../../domain/enums/connector.enums';

export interface CreateConnectorDto {
  name: string;
  type: ConnectorType;
  version: string;
  capabilities: ConnectorCapability[];
  metadata: {
    description: string;
    provider: string;
    license: string;
    documentationUrl?: string;
    tags?: string[];
    signature?: string;
  };
}

export interface UpdateConnectorDto {
  name?: string;
  description?: string;
  documentationUrl?: string;
  tags?: string[];
}

export interface ConfigureConnectorDto {
  settings: Record<string, unknown>;
  isSandbox?: boolean;
  timeoutMs?: number;
  maxRetryAttempts?: number;
  allowedEndpoints?: string[];
  credentialReference: {
    secretArn: string;
    provider: 'HASHICORP_VAULT' | 'AWS_SECRETS_MANAGER' | 'GCP_SECRET_MANAGER' | 'AZURE_KEY_VAULT' | 'CUSTOM_VAULT';
    secretKeyRef: string;
    version?: string;
  };
  endpointUrl?: string;
  environment?: 'PRODUCTION' | 'SANDBOX' | 'STAGING';
}

export interface ConnectConnectorDto {
  endpointUrl: string;
  environment?: 'PRODUCTION' | 'SANDBOX' | 'STAGING';
}

export interface DisconnectConnectorDto {
  reason: string;
}

export interface PublishVersionDto {
  version: string;
}

export interface ConnectorQueryDto {
  tenantId?: string;
  type?: ConnectorType;
  status?: ConnectorStatus;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ConnectorResponseDto {
  id: string;
  tenantId: string;
  name: string;
  type: ConnectorType;
  version: string;
  status: ConnectorStatus;
  configuration: {
    settings: Record<string, unknown>;
    isSandbox: boolean;
    timeoutMs: number;
    maxRetryAttempts: number;
    allowedEndpoints: string[];
  };
  capabilities: ConnectorCapability[];
  credentialReference?: {
    secretArn: string;
    provider: string;
    secretKeyRef: string;
    version?: string;
    updatedAt: Date;
  };
  endpoint?: {
    baseUrl: string;
    environment: string;
  };
  health: {
    isHealthy: boolean;
    healthScore: number;
    latencyMs: number;
    availabilityRate: number;
    failureRate: number;
    successRate: number;
    errorDetails?: string;
    lastCheckedAt: Date;
    lastSuccessfulConnection?: Date;
  };
  metadata: {
    description: string;
    provider: string;
    license: string;
    documentationUrl?: string;
    tags: string[];
    signature?: string;
    signedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
