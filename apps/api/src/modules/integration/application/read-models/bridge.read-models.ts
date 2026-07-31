/**
 * Enterprise Integration Event Bridge - CQRS Read Models
 */

import { BridgeStatus, EventSourceType, EventTargetType } from '../../domain/enums/bridge.enums';

export interface BridgeDashboard {
  totalIngested: number;
  totalTranslated: number;
  totalPublished: number;
  totalDeadLettered: number;
  activeConnectorsCount: number;
  throughputPerMin: number;
}

export interface TranslationHistoryItem {
  bridgeEventId: string;
  externalEventId: string;
  internalEventId?: string;
  tenantId: string;
  connectorId: string;
  sourceType: EventSourceType;
  targetType: EventTargetType;
  status: BridgeStatus;
  isReplay: boolean;
  timestamp: Date;
}

export interface TranslationHistory {
  totalCount: number;
  items: TranslationHistoryItem[];
}

export interface DeadLetterItem {
  bridgeEventId: string;
  tenantId: string;
  connectorId: string;
  sourceType: EventSourceType;
  failureReason: string;
  attemptCount: number;
  deadLetteredAt: Date;
}

export interface DeadLetterQueue {
  totalCount: number;
  deadLetters: DeadLetterItem[];
}

export interface ReplayHistoryItem {
  bridgeEventId: string;
  tenantId: string;
  connectorId: string;
  replayedAt: Date;
  requestedBy: string;
  status: BridgeStatus;
}

export interface ReplayHistory {
  totalCount: number;
  items: ReplayHistoryItem[];
}

export interface BridgeStatistics {
  totalEvents: number;
  byStatus: Record<BridgeStatus, number>;
  bySourceType: Record<EventSourceType, number>;
  averageTranslationLatencyMs: number;
}

export interface RoutingMetrics {
  totalRoutesCount: number;
  topRoutedEventTypes: { sourceEvent: string; targetEvent: string; count: number }[];
}
