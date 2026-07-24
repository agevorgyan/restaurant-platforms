export interface ProjectionSnapshot {
  snapshotId: string;
  projectionId: string;
  datasetName: string;
  version: number;
  data: Record<string, any>;
  capturedAt: Date;
  refreshPolicy: string;
}

export interface MaterializedView {
  viewId: string;
  name: string;
  domain: string;
  schemaDefinition: Record<string, string>;
  rowCount: number;
  lastRefreshedAt: Date;
  status: string;
}

export interface AnalyticalDataset {
  datasetId: string;
  name: string;
  description: string;
  retentionPolicy: string;
  columns: string[];
  dataPreview: Record<string, any>[];
  totalRecords: number;
}

export interface HistoricalDataset {
  datasetId: string;
  name: string;
  period: string; // YEARLY, MONTHLY
  archivedAt: Date;
  storageLocation: string; // e.g., s3://bucket/path
  compressionType: string;
}

export interface AggregationResult {
  aggregationId: string;
  datasetId: string;
  dimensions: string[];
  metrics: string[];
  results: Record<string, any>[];
  calculatedAt: Date;
}
