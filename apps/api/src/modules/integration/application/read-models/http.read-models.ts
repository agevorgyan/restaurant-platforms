/**
 * Enterprise HTTP & API Integration Platform - CQRS Read Models
 */

import { CircuitState, RequestStatus, ProtocolType } from '../../domain/enums/http.enums';

export interface RequestHistoryEntry {
  requestId: string;
  tenantId: string;
  connectorId: string;
  protocol: ProtocolType;
  endpointUrl: string;
  method: string;
  correlationId: string;
  idempotencyKey?: string;
  status: RequestStatus;
  statusCode?: number;
  latencyMs: number;
  attemptCount: number;
  errorDetails?: string;
  timestamp: Date;
}

export interface RequestHistory {
  totalCount: number;
  requests: RequestHistoryEntry[];
}

export interface CircuitBreakerItem {
  connectorId: string;
  tenantId: string;
  state: CircuitState;
  successCount: number;
  failureCount: number;
  totalRequests: number;
  failureRatePct: number;
  lastStateChangeAt: Date;
}

export interface CircuitBreakerDashboard {
  closedCount: number;
  openCount: number;
  halfOpenCount: number;
  circuits: CircuitBreakerItem[];
}

export interface RateLimitStatus {
  connectorId: string;
  tenantId: string;
  requestsPerWindow: number;
  windowSizeMs: number;
  currentWindowUsage: number;
  remainingCapacity: number;
  isExceeded: boolean;
  resetsInMs: number;
}

export interface RateLimitDashboard {
  connectors: RateLimitStatus[];
}

export interface ApiLatencyStatistics {
  connectorId?: string;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  averageLatencyMs: number;
  minLatencyMs: number;
  maxLatencyMs: number;
  sampleSize: number;
}

export interface FailureStatistics {
  totalFailures: number;
  serverErrorCount: number; // 5xx
  clientErrorCount: number; // 4xx
  timeoutCount: number;
  circuitOpenBlockCount: number;
  rateLimitExceededCount: number;
  byConnector: Record<string, number>;
}

export interface ConnectorTrafficItem {
  connectorId: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  throughputPerMin: number;
  lastRequestAt?: Date;
}

export interface ConnectorTraffic {
  connectors: ConnectorTrafficItem[];
}
