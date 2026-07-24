export interface ConnectorDefinition {
  connectorId: string;
  name: string;
  type: string;
  description: string;
  supportedSchemas: string[];
}

export interface ConnectorConfiguration {
  configId: string;
  connectorId: string;
  targetId: string;
  accessPolicy: string;
  apiTokens: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublishedDataset {
  publicationId: string;
  datasetReference: string;
  connectorId: string;
  schemaVersion: string;
  publishedAt: Date;
  accessUrl: string;
  isPublic: boolean;
}

export interface ConnectorHealth {
  connectorId: string;
  status: string;
  lastPingAt: Date;
  uptimePercentage: number;
  errorCountLast24h: number;
}

export interface ConnectorUsage {
  connectorId: string;
  bytesTransferred: number;
  queryCount: number;
  activeUsers: number;
  periodStart: Date;
  periodEnd: Date;
}
