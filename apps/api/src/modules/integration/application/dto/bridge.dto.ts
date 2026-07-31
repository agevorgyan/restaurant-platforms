/**
 * Enterprise Integration Event Bridge - Application DTOs
 */

import { EventSourceType, EventTargetType, BridgeStatus } from '../../domain/enums/bridge.enums';

export interface IngestExternalEventDto {
  connectorId: string;
  sourceType: EventSourceType;
  sourceEventType: string;
  externalEventId?: string;
  correlationId?: string;
  payload: Record<string, unknown>;
}

export interface ReplayBridgeEventDto {
  bridgeEventId: string;
  requestedBy?: string;
}

export interface BridgeQueryDto {
  tenantId?: string;
  connectorId?: string;
  status?: BridgeStatus;
  limit?: number;
  offset?: number;
}

export interface BridgeEventResponseDto {
  bridgeEventId: string;
  tenantId: string;
  connectorId: string;
  externalEventId: string;
  internalEventId?: string;
  correlationId: string;
  sourceType: EventSourceType;
  targetType: EventTargetType;
  status: BridgeStatus;
  isReplay: boolean;
  attemptCount: number;
  errorReason?: string;
  receivedAt: Date;
}
