export interface MediaSummary {
  mediaId: string;
  tenantId: string;
  type: string;
  format: string;
  mimeType: string;
  fileSizeBytes: number;
  status: string;
  thumbnailUrl?: string;
  purpose: string;
  createdAt: Date;
}

export interface MediaDetails extends MediaSummary {
  checksum: string;
  visibility: string;
  storageKey: string;
  resolution?: { width: number; height: number };
  durationSeconds?: number;
  bitrateKbps?: number;
  metadata: Record<string, any>;
  variants: Record<string, string>;
  cdnUrl?: string;
  updatedAt: Date;
}

export interface MediaUsage {
  tenantId: string;
  totalStorageBytes: number;
  totalAssetsCount: number;
  breakdownByType: Record<string, number>; // e.g. { "IMAGE": 1500, "VIDEO": 42 }
}

export interface MediaStatistics {
  tenantId: string;
  averageUploadSize: number;
  mostCommonFormats: string[];
  bandwidthUsageEstimateBytes: number;
  period: string; // YYYY-MM
}
