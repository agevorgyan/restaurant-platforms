/**
 * Enterprise HTTP & API Integration Platform - Application DTOs
 */

import { HttpMethodEnum, ProtocolType, RequestStatus, CircuitState, AuthenticationType } from '../../domain/enums/http.enums';

export interface ExecuteHttpRequestDto {
  connectorId: string;
  protocol?: ProtocolType;
  endpointUrl: string;
  method: HttpMethodEnum;
  headers?: Record<string, string>;
  body?: unknown;
  correlationId?: string;
  idempotencyKey?: string;
  timeoutMs?: number;
  maxRetryAttempts?: number;
  auth?: {
    type: AuthenticationType;
    credentialsRef?: {
      secretArn: string;
      secretKeyRef: string;
    };
    token?: string;
    apiKey?: string;
  };
}

export interface OutboundResponseDto {
  requestId: string;
  correlationId: string;
  connectorId: string;
  status: RequestStatus;
  statusCode?: number;
  latencyMs: number;
  attemptCount: number;
  headers: Record<string, string>;
  data: unknown;
  errorDetails?: string;
  executedAt: Date;
}

export interface TestOutboundRequestDto {
  connectorId: string;
  endpointUrl: string;
  method?: HttpMethodEnum;
  headers?: Record<string, string>;
  body?: unknown;
}

export interface HttpQueryDto {
  tenantId?: string;
  connectorId?: string;
  status?: RequestStatus;
  limit?: number;
  offset?: number;
}
