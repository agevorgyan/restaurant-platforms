export interface RegisteredProvider {
  name: string;
  capabilities: {
    supportsPresignedUrls: boolean;
    supportsVersioning: boolean;
    supportsEncryption: boolean;
    supportsStorageClasses: boolean;
    supportedStorageClasses: string[];
  };
  isActive: boolean;
}

export interface ProviderStatistics {
  providerName: string;
  totalUploads: number;
  totalDownloads: number;
  successRate: number; // percentage
  averageLatencyMs: number;
  dataTransferredBytes: number;
  period: string; // YYYY-MM
}

export interface ProviderHealthModel {
  providerName: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  latencyMs: number;
  lastChecked: Date;
  details?: Record<string, any>;
}

export interface StorageUsage {
  tenantId: string;
  providerName: string;
  bucketName: string;
  totalBytes: number;
  objectCount: number;
  lastUpdated: Date;
}
