export interface DeliveryStatistics {
  tenantId: string;
  totalBytesDelivered: number;
  totalRequests: number;
  uniqueMediaServed: number;
  period: string; // YYYY-MM
}

export interface CacheStatistics {
  tenantId: string;
  cacheHitRatio: number;
  cacheMissRatio: number;
  totalPurgeRequests: number;
  period: string;
}

export interface EdgeStatistics {
  tenantId: string;
  requestsByRegion: Record<string, number>; // e.g. { "US-EAST": 15000, "EU-WEST": 8000 }
  averageLatencyMs: number;
  period: string;
}

export interface DeliveryHistory {
  tenantId: string;
  mediaId: string;
  lastAccessedAt: Date;
  totalAccesses: number;
  bytesDelivered: number;
}

export interface ProviderHealth {
  providerName: string;
  isAvailable: boolean;
  latencyMs: number;
  errorRate: number; // percentage
  lastCheckedAt: Date;
}
