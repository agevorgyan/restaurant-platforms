export interface RouteDefinition {
  routeId: string;
  path: string;
  method: string;
  upstreamUrl: string;
  version: string;
  policy: string;
  requiredScopes: string[];
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  isActive: boolean;
}

export interface ApiConsumerProfile {
  consumerId: string;
  consumerType: string;
  apiKeyHash?: string;
  allowedScopes: string[];
  createdAt: Date;
  status: string;
}

export interface GatewayHealth {
  status: string;
  uptimeSeconds: number;
  activeRoutes: number;
  activeConnections: number;
  lastReloadedAt: Date;
}

export interface RouteStatistics {
  routeId: string;
  requestCount24h: number;
  errorCount24h: number;
  averageLatencyMs: number;
  p99LatencyMs: number;
}

export interface ApiUsage {
  consumerId: string;
  period: string; // e.g. YYYY-MM
  totalRequests: number;
  rateLimitExceededCount: number;
}
