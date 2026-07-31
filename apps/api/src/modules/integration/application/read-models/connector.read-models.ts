/**
 * Enterprise Connector Platform - CQRS Read Models
 *
 * Implements read-optimized projections and query models for catalog management,
 * health dashboards, metric statistics, version tracking, capability discovery, and tenant inventory.
 */

import { ConnectorType, ConnectorStatus, ConnectorCapability } from '../../domain/enums/connector.enums';

export interface ConnectorDefinition {
  connectorId: string;
  code: string;
  name: string;
  type: ConnectorType;
  version: string;
  provider: string;
  description: string;
  capabilities: ConnectorCapability[];
  metadata: {
    license: string;
    documentationUrl?: string;
    tags: string[];
    signature?: string;
  };
  createdAt: Date;
}

export interface InstalledConnector {
  installationId: string;
  tenantId: string;
  connectorId: string;
  name: string;
  type: ConnectorType;
  status: ConnectorStatus;
  isSandbox: boolean;
  installedAt: Date;
  updatedAt: Date;
}

/**
 * ConnectorCatalog CQRS Read Model
 * Represents available connector blueprints and templates in the registry.
 */
export interface ConnectorCatalog {
  totalCount: number;
  categories: { type: ConnectorType; count: number }[];
  connectors: ConnectorDefinition[];
}

/**
 * ConnectorHealthDashboard CQRS Read Model
 * Comprehensive health dashboard monitoring across all tenant connectors.
 */
export interface ConnectorHealthItem {
  connectorId: string;
  tenantId: string;
  name: string;
  type: ConnectorType;
  status: ConnectorStatus;
  isHealthy: boolean;
  healthScore: number;
  latencyMs: number;
  availabilityRate: number;
  failureRate: number;
  lastCheckedAt: Date;
  lastSuccessfulConnection?: Date;
  errorDetails?: string;
}

export interface ConnectorHealthDashboard {
  healthyCount: number;
  degradedCount: number;
  disconnectedCount: number;
  disabledCount: number;
  averageHealthScore: number;
  connectors: ConnectorHealthItem[];
}

/**
 * ConnectorStatistics CQRS Read Model
 * High-level system statistics and operational metrics.
 */
export interface ConnectorStatistics {
  totalRegistered: number;
  totalActive: number;
  totalDegraded: number;
  totalDisabled: number;
  byType: Record<ConnectorType, number>;
  byStatus: Record<ConnectorStatus, number>;
  averageLatencyMs: number;
  overallUptimeRate: number;
  overallSuccessRate: number;
}

/**
 * ConnectorVersions CQRS Read Model
 * History and semver compatibility log per connector definition.
 */
export interface ConnectorVersionEntry {
  version: string;
  publishedAt: Date;
  isDeprecated: boolean;
  deprecationReason?: string;
  breakingChanges: boolean;
}

export interface ConnectorVersions {
  connectorId: string;
  currentVersion: string;
  supportedVersions: ConnectorVersionEntry[];
}

/**
 * CapabilityCatalog CQRS Read Model
 * Discovery view mapping capabilities to matching connectors.
 */
export interface CapabilityCatalogEntry {
  capability: ConnectorCapability;
  description: string;
  connectors: {
    connectorId: string;
    name: string;
    type: ConnectorType;
    version: string;
  }[];
}

export interface CapabilityCatalog {
  totalCapabilities: number;
  capabilities: CapabilityCatalogEntry[];
}

/**
 * ConnectorInventory CQRS Read Model
 * Tenant-scoped view of installed and configured connector instances.
 */
export interface ConnectorInventory {
  tenantId: string;
  totalConnectors: number;
  activeConnectors: number;
  inventory: InstalledConnector[];
}

// Retain legacy interfaces for backward compatibility
export interface ConnectorCapabilityModel {
  capabilityId: string;
  name: string;
  description: string;
  isRequired: boolean;
}

export interface ConnectorHealthStatus {
  installationId: string;
  connectorId: string;
  tenantId: string;
  isHealthy: boolean;
  latencyMs: number;
  lastCheckedAt: Date;
}
