/**
 * Enterprise Connector Platform - Hexagonal Domain Ports
 *
 * Defines driven ports (interfaces) for data persistence, event publishing,
 * Enterprise Secrets Platform resolution, and network health probing.
 */

import { ConnectorAggregate } from '../models/connector.aggregate';
import { ConnectorId } from '../value-objects/connector-vo';
import { ConnectorType, ConnectorStatus } from '../enums/connector.enums';
import { BaseDomainEvent } from '../events/connector.events';
import { ConnectorCredentialReference } from '../value-objects/connector-vo';

export interface ConnectorSearchFilters {
  tenantId?: string;
  type?: ConnectorType;
  status?: ConnectorStatus;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ConnectorRepositoryPort {
  save(connector: ConnectorAggregate): Promise<void>;
  findById(id: ConnectorId, tenantId?: string): Promise<ConnectorAggregate | null>;
  findByTenant(tenantId: string, filters?: ConnectorSearchFilters): Promise<ConnectorAggregate[]>;
  findCatalog(filters?: ConnectorSearchFilters): Promise<ConnectorAggregate[]>;
  findAll(filters?: ConnectorSearchFilters): Promise<ConnectorAggregate[]>;
  delete(id: ConnectorId, tenantId: string): Promise<boolean>;
}

export interface SecretResolverPort {
  validateCredentialReference(ref: ConnectorCredentialReference): Promise<{ isValid: boolean; message?: string }>;
  verifySecretExists(secretArn: string, provider: string): Promise<boolean>;
}

export interface EventPublisherPort {
  publish(event: BaseDomainEvent): Promise<void>;
  publishAll(events: BaseDomainEvent[]): Promise<void>;
}

export interface HealthCheckPort {
  pingEndpoint(endpointUrl: string, timeoutMs: number): Promise<{ isReachable: boolean; latencyMs: number; error?: string }>;
}
