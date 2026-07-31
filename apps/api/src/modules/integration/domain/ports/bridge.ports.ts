/**
 * Enterprise Integration Event Bridge - Hexagonal Domain Ports
 */

import { BridgeEventAggregate } from '../models/bridge-event.aggregate';
import { BridgeEventId, BridgeRoute } from '../value-objects/bridge-vo';

export interface BridgeRepositoryPort {
  save(event: BridgeEventAggregate): Promise<void>;
  findById(id: BridgeEventId): Promise<BridgeEventAggregate | null>;
  findHistory(filters?: {
    tenantId?: string;
    connectorId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<BridgeEventAggregate[]>;
}

export interface BridgeDLQRepositoryPort {
  save(event: BridgeEventAggregate): Promise<void>;
  findDeadLetters(filters?: {
    tenantId?: string;
    connectorId?: string;
    limit?: number;
    offset?: number;
  }): Promise<BridgeEventAggregate[]>;
  remove(id: BridgeEventId): Promise<boolean>;
}

export interface BridgeRouteRegistryPort {
  resolveRoute(sourceEventType: string, connectorId: string): Promise<BridgeRoute | null>;
  registerRoute(route: BridgeRoute, connectorId: string): Promise<void>;
}
