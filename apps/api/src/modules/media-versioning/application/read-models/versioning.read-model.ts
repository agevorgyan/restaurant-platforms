export interface MediaVersionHistory {
  mediaId: string;
  tenantId: string;
  currentVersionId: string;
  versions: Array<{
    versionId: string;
    versionNumber: number;
    status: 'CURRENT' | 'PREVIOUS' | 'ARCHIVED' | 'DELETED';
    storageKey: string;
    createdAt: Date;
  }>;
}

export interface LifecycleHistory {
  mediaId: string;
  tenantId: string;
  transitions: Array<{
    fromState: string;
    toState: string;
    reason: string;
    transitionedAt: Date;
  }>;
}

export interface RetentionStatistics {
  tenantId: string;
  totalAssetsUnderRetention: number;
  assetsExpiringNext30Days: number;
  period: string;
}

export interface ArchiveStatistics {
  tenantId: string;
  totalArchivedAssets: number;
  totalArchivedBytes: number;
  restorationRequestsPending: number;
}

export interface DeletedMedia {
  mediaId: string;
  tenantId: string;
  deletedAt: Date;
  isHardDeleted: boolean;
  retentionExpiresAt?: Date; // Time until soft delete becomes hard delete
}

export interface TransformationDependencies {
  mediaId: string;
  versionId: string;
  dependentTransformations: Array<{
    jobId: string;
    type: string;
    status: string;
  }>;
}
