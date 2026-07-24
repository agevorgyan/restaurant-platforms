export interface ConnectorCapabilityModel {
  capabilityId: string;
  name: string;
  description: string;
  isRequired: boolean;
}

export interface ConnectorDefinition {
  connectorId: string;
  code: string;
  name: string;
  type: string;
  version: string;
  provider: string;
  description: string;
  capabilities: ConnectorCapabilityModel[];
  createdAt: Date;
}

export interface InstalledConnector {
  installationId: string;
  tenantId: string;
  connectorId: string;
  status: 'REGISTERED' | 'INSTALLED' | 'CONFIGURED' | 'VALIDATED' | 'ENABLED' | 'DISABLED' | 'ERROR';
  isSandbox: boolean;
  installedAt: Date;
  lastSyncAt?: Date;
}

export interface ConnectorHealthStatus {
  installationId: string;
  connectorId: string;
  tenantId: string;
  isHealthy: boolean;
  latencyMs: number;
  lastCheckedAt: Date;
  errorMessage?: string;
}

export interface ConnectorStatistics {
  connectorId: string;
  activeInstallations: number;
  totalSyncs24h: number;
  failedSyncs24h: number;
  averageLatencyMs: number;
}

export interface ConnectorUsage {
  installationId: string;
  tenantId: string;
  month: string;
  apiCalls: number;
  dataBytesTransferred: number;
}
