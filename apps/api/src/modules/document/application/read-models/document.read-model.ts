export interface DocumentSummary {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  status: string;
  visibility: string;
  mimeType?: string;
  fileSize?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentDetails extends DocumentSummary {
  provider?: string;
  bucket?: string;
  objectKey?: string;
  extension?: string;
  checksum?: string;
  storageClass?: string;
  metadata: Record<string, any>;
  createdBy: string;
  presignedUrl?: string; // Hydrated at presentation layer
}

export interface StorageStatistics {
  tenantId: string;
  totalDocuments: number;
  totalStorageBytes: number;
  storageByClass: {
    HOT: number;
    WARM: number;
    COLD: number;
    ARCHIVE: number;
  };
  storageByType: Record<string, number>;
  lastCalculated: Date;
}

export interface DocumentUsage {
  tenantId: string;
  period: string; // YYYY-MM
  uploadCount: number;
  downloadCount: number;
  bandwidthBytes: number;
}
