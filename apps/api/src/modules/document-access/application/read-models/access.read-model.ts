export interface AccessAuditRecord {
  auditId: string;
  documentId: string;
  tenantId: string;
  userId: string;
  accessType: 'UPLOAD' | 'DOWNLOAD' | 'VIEW' | 'DELETE';
  decision: 'ALLOW' | 'DENY' | 'EXPIRED';
  reason?: string;
  ipAddress?: string;
  timestamp: Date;
}

export interface SignedUrlRecord {
  urlId: string;
  documentId: string;
  tenantId: string;
  generatedByUserId: string;
  accessType: 'UPLOAD' | 'DOWNLOAD';
  url: string;
  expiresAt: Date;
  isSingleUse: boolean;
  wasUsed: boolean;
  createdAt: Date;
}

export interface PermissionEvaluation {
  tenantId: string;
  documentId: string;
  userId: string;
  decision: 'ALLOW' | 'DENY';
  evaluatedRoles: string[];
  evaluationTime: Date;
}

export interface AccessStatistics {
  tenantId: string;
  totalUploads: number;
  totalDownloads: number;
  deniedRequests: number;
  period: string; // YYYY-MM
}
