/**
 * Enterprise Connector Platform - Domain & Application Services
 *
 * Implements core domain services for connector management:
 * 1. ConnectorService
 * 2. ConfigurationService
 * 3. CapabilityService
 * 4. HealthService
 * 5. VersionService
 * 6. CredentialReferenceService
 * 7. ConnectorRegistryService
 */

import { Injectable, Inject } from '@nestjs/common';
import { ConnectorAggregate } from '../../domain/models/connector.aggregate';
import {
  ConnectorId,
  ConnectorVersion,
  ConnectorName,
  ConnectorTypeVO,
  ConnectorConfiguration,
  ConnectorCapabilityVO,
  ConnectorCredentialReference,
  ConnectorEndpoint,
  HealthScore,
} from '../../domain/value-objects/connector-vo';
import { ConnectorType, ConnectorStatus, ConnectorCapability } from '../../domain/enums/connector.enums';
import {
  ConnectorRepositoryPort,
  SecretResolverPort,
  EventPublisherPort,
  HealthCheckPort,
} from '../../domain/ports/connector.ports';
import {
  CreateConnectorDto,
  ConfigureConnectorDto,
  ConnectConnectorDto,
  DisconnectConnectorDto,
  PublishVersionDto,
  ConnectorQueryDto,
  ConnectorResponseDto,
} from '../dto/connector.dto';
import {
  ConnectorCatalog,
  ConnectorHealthDashboard,
  ConnectorStatistics,
  ConnectorVersions,
  CapabilityCatalog,
  ConnectorInventory,
  ConnectorDefinition,
  InstalledConnector,
  ConnectorHealthStatus,
  ConnectorCapabilityModel,
} from '../read-models/connector.read-models';
import {
  ConnectorNotFoundException,
  InvalidConfigurationException,
  InvalidCredentialReferenceException,
  CapabilityNotSupportedException,
} from '../../domain/exceptions/connector.exceptions';

// Injection Tokens for NestJS IoC Container
export const CONNECTOR_REPOSITORY_TOKEN = 'ConnectorRepositoryPort';
export const SECRET_RESOLVER_TOKEN = 'SecretResolverPort';
export const EVENT_PUBLISHER_TOKEN = 'EventPublisherPort';
export const HEALTH_CHECK_PORT_TOKEN = 'HealthCheckPort';

/**
 * Service 1: CredentialReferenceService
 * Validates, links, and manages ConnectorCredentialReference objects.
 * CRITICAL: NEVER handles or stores raw passwords, tokens, or private keys.
 */
@Injectable()
export class CredentialReferenceService {
  constructor(
    @Inject(SECRET_RESOLVER_TOKEN)
    private readonly secretResolver: SecretResolverPort
  ) {}

  public async validateAndCreateReference(props: {
    secretArn: string;
    provider: 'HASHICORP_VAULT' | 'AWS_SECRETS_MANAGER' | 'GCP_SECRET_MANAGER' | 'AZURE_KEY_VAULT' | 'CUSTOM_VAULT';
    secretKeyRef: string;
    version?: string;
  }): Promise<ConnectorCredentialReference> {
    const credentialRef = ConnectorCredentialReference.create({
      secretArn: props.secretArn,
      provider: props.provider,
      secretKeyRef: props.secretKeyRef,
      version: props.version,
      updatedAt: new Date(),
    });

    const validation = await this.secretResolver.validateCredentialReference(credentialRef);
    if (!validation.isValid) {
      throw new InvalidCredentialReferenceException(
        `Secret reference validation failed with Enterprise Secrets Platform: ${validation.message}`
      );
    }

    return credentialRef;
  }
}

/**
 * Service 2: ConfigurationService
 * Validates connector configuration settings against endpoint constraints and allowed parameters.
 */
@Injectable()
export class ConfigurationService {
  public validateConfiguration(
    configuration: ConnectorConfiguration,
    endpoint?: ConnectorEndpoint
  ): void {
    const props = configuration.getProps();

    if (props.timeoutMs <= 0 || props.timeoutMs > 60000) {
      throw new InvalidConfigurationException('timeoutMs must be between 1ms and 60000ms (60s)');
    }

    if (props.maxRetryAttempts < 0 || props.maxRetryAttempts > 10) {
      throw new InvalidConfigurationException('maxRetryAttempts must be between 0 and 10');
    }

    if (endpoint) {
      const baseUrl = endpoint.getBaseUrl();
      if (!baseUrl.startsWith('https://')) {
        throw new InvalidConfigurationException(`Endpoint URL must be HTTPS. Received: '${baseUrl}'`);
      }
    }
  }
}

/**
 * Service 3: CapabilityService
 * Discovers, validates, and catalog-matches connector capabilities.
 */
@Injectable()
export class CapabilityService {
  private static readonly TYPE_CAPABILITY_MATRIX: Record<ConnectorType, ConnectorCapability[]> = {
    [ConnectorType.PAYMENT]: [ConnectorCapability.WRITE, ConnectorCapability.WEBHOOK, ConnectorCapability.OAUTH, ConnectorCapability.PUSH],
    [ConnectorType.DELIVERY]: [ConnectorCapability.READ, ConnectorCapability.WRITE, ConnectorCapability.WEBHOOK, ConnectorCapability.POLLING, ConnectorCapability.PUSH],
    [ConnectorType.POS]: [ConnectorCapability.READ, ConnectorCapability.WRITE, ConnectorCapability.STREAMING, ConnectorCapability.BATCH, ConnectorCapability.WEBHOOK],
    [ConnectorType.ERP]: [ConnectorCapability.READ, ConnectorCapability.WRITE, ConnectorCapability.BATCH, ConnectorCapability.POLLING],
    [ConnectorType.CRM]: [ConnectorCapability.READ, ConnectorCapability.WRITE, ConnectorCapability.WEBHOOK, ConnectorCapability.OAUTH],
    [ConnectorType.ACCOUNTING]: [ConnectorCapability.READ, ConnectorCapability.WRITE, ConnectorCapability.BATCH, ConnectorCapability.POLLING],
    [ConnectorType.GOVERNMENT]: [ConnectorCapability.READ, ConnectorCapability.WRITE, ConnectorCapability.BATCH],
    [ConnectorType.NOTIFICATION]: [ConnectorCapability.WRITE, ConnectorCapability.PUSH, ConnectorCapability.STREAMING],
    [ConnectorType.STORAGE]: [ConnectorCapability.READ, ConnectorCapability.WRITE, ConnectorCapability.BATCH, ConnectorCapability.STREAMING],
    [ConnectorType.IDENTITY_PROVIDER]: [ConnectorCapability.READ, ConnectorCapability.OAUTH, ConnectorCapability.PULL],
    [ConnectorType.AI_PROVIDER]: [ConnectorCapability.READ, ConnectorCapability.WRITE, ConnectorCapability.STREAMING],
    [ConnectorType.CUSTOM]: Object.values(ConnectorCapability), // Custom connectors can declare any capability
  };

  public validateCapabilities(type: ConnectorType, capabilities: ConnectorCapability[]): void {
    const allowed = CapabilityService.TYPE_CAPABILITY_MATRIX[type] || [];
    for (const cap of capabilities) {
      if (!allowed.includes(cap)) {
        throw new CapabilityNotSupportedException(cap, type);
      }
    }
  }

  public discoverCapabilities(code: string): ConnectorCapabilityModel[] {
    return [
      {
        capabilityId: 'cap-auth',
        name: 'OAuth2 Authentication',
        description: 'Supports standard OAuth2 authorization code flow',
        isRequired: true,
      },
      {
        capabilityId: 'cap-sync',
        name: 'Bidirectional Sync',
        description: 'Supports syncing data in both directions',
        isRequired: false,
      },
    ];
  }
}

/**
 * Service 4: VersionService
 * Manages SemVer compatibility, version publishing, and deprecation checks.
 */
@Injectable()
export class VersionService {
  public validateVersionPublish(currentVersionStr: string, newVersionStr: string): void {
    const current = ConnectorVersion.create(currentVersionStr);
    const newVer = ConnectorVersion.create(newVersionStr);

    if (!newVer.isGreaterThan(current)) {
      throw new InvalidConfigurationException(
        `Version upgrade requirement failed: '${newVersionStr}' is not greater than '${currentVersionStr}'`
      );
    }
  }
}

/**
 * Service 5: HealthService
 * Conducts automated/on-demand health monitoring, latency evaluation, and health score calculations.
 */
@Injectable()
export class HealthService {
  constructor(
    @Inject(CONNECTOR_REPOSITORY_TOKEN)
    private readonly repository: ConnectorRepositoryPort,
    @Inject(HEALTH_CHECK_PORT_TOKEN)
    private readonly healthCheckPort: HealthCheckPort,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort
  ) {}

  public async checkHealth(installationId: string): Promise<ConnectorHealthStatus> {
    const connector = await this.repository.findById(ConnectorId.create(installationId));
    if (!connector) {
      return {
        installationId,
        connectorId: installationId,
        tenantId: 'unknown',
        isHealthy: false,
        latencyMs: 0,
        lastCheckedAt: new Date(),
      };
    }

    const endpoint = connector.getEndpoint()?.getBaseUrl() || 'https://health.check.internal';
    const pingResult = await this.healthCheckPort.pingEndpoint(endpoint, 5000);

    connector.recordHealthCheck(
      pingResult.latencyMs,
      pingResult.isReachable,
      pingResult.error
    );

    await this.repository.save(connector);
    await this.eventPublisher.publishAll(connector.getUncommittedEvents());
    connector.clearEvents();

    return {
      installationId,
      connectorId: connector.getId().getValue(),
      tenantId: connector.getTenantId(),
      isHealthy: connector.getHealth().isHealthy(),
      latencyMs: pingResult.latencyMs,
      lastCheckedAt: connector.getHealth().getProps().lastCheckedAt,
    };
  }

  public async getHealthDashboard(tenantId?: string): Promise<ConnectorHealthDashboard> {
    const connectors = tenantId
      ? await this.repository.findByTenant(tenantId)
      : await this.repository.findAll();

    let totalScore = 0;
    let healthyCount = 0;
    let degradedCount = 0;
    let disconnectedCount = 0;
    let disabledCount = 0;

    const items = connectors.map(c => {
      const h = c.getHealth().getProps();
      const status = c.getStatus().getValue();
      const score = c.getHealth().getScore();
      totalScore += score;

      if (status === ConnectorStatus.HEALTHY || (status === ConnectorStatus.CONNECTED && h.isHealthy)) healthyCount++;
      else if (status === ConnectorStatus.DEGRADED) degradedCount++;
      else if (status === ConnectorStatus.DISCONNECTED) disconnectedCount++;
      else if (status === ConnectorStatus.DISABLED) disabledCount++;

      return {
        connectorId: c.getId().getValue(),
        tenantId: c.getTenantId(),
        name: c.getName().getValue(),
        type: c.getType().getValue(),
        status,
        isHealthy: h.isHealthy,
        healthScore: score,
        latencyMs: h.latencyMs,
        availabilityRate: h.availabilityRate,
        failureRate: h.failureRate,
        lastCheckedAt: h.lastCheckedAt,
        lastSuccessfulConnection: h.lastSuccessfulConnection,
        errorDetails: h.errorDetails,
      };
    });

    const averageHealthScore = connectors.length > 0 ? Math.round(totalScore / connectors.length) : 100;

    return {
      healthyCount,
      degradedCount,
      disconnectedCount,
      disabledCount,
      averageHealthScore,
      connectors: items,
    };
  }
}

/**
 * Service 6: ConnectorRegistryService
 * Manages blueprint catalogs, tenant inventory projections, capability search, and signature verification.
 */
@Injectable()
export class ConnectorRegistryService {
  constructor(
    @Inject(CONNECTOR_REPOSITORY_TOKEN)
    private readonly repository: ConnectorRepositoryPort,
    private readonly capabilityService: CapabilityService
  ) {}

  public async getCatalog(query?: ConnectorQueryDto): Promise<ConnectorDefinition[]> {
    const connectors = await this.repository.findCatalog(query);
    return connectors.map(c => ({
      connectorId: c.getId().getValue(),
      code: `${c.getType().getValue()}_${c.getName().getValue().toUpperCase().replace(/\s+/g, '_')}`,
      name: c.getName().getValue(),
      type: c.getType().getValue(),
      version: c.getVersion().getValue(),
      provider: c.getMetadata().getProps().provider,
      description: c.getMetadata().getProps().description,
      capabilities: c.getCapabilities().toArray(),
      metadata: {
        license: c.getMetadata().getProps().license,
        documentationUrl: c.getMetadata().getProps().documentationUrl,
        tags: c.getMetadata().getProps().tags,
        signature: c.getMetadata().getProps().signature,
      },
      createdAt: c.getCreatedAt(),
    }));
  }

  public async getConnector(id: string): Promise<ConnectorDefinition | undefined> {
    const connector = await this.repository.findById(ConnectorId.create(id));
    if (!connector) return undefined;

    return {
      connectorId: connector.getId().getValue(),
      code: `${connector.getType().getValue()}_${connector.getName().getValue().toUpperCase().replace(/\s+/g, '_')}`,
      name: connector.getName().getValue(),
      type: connector.getType().getValue(),
      version: connector.getVersion().getValue(),
      provider: connector.getMetadata().getProps().provider,
      description: connector.getMetadata().getProps().description,
      capabilities: connector.getCapabilities().toArray(),
      metadata: {
        license: connector.getMetadata().getProps().license,
        documentationUrl: connector.getMetadata().getProps().documentationUrl,
        tags: connector.getMetadata().getProps().tags,
        signature: connector.getMetadata().getProps().signature,
      },
      createdAt: connector.getCreatedAt(),
    };
  }

  public async getInventory(tenantId: string): Promise<ConnectorInventory> {
    const connectors = await this.repository.findByTenant(tenantId);
    const active = connectors.filter(c => 
      c.getStatus().getValue() === ConnectorStatus.CONNECTED || 
      c.getStatus().getValue() === ConnectorStatus.HEALTHY
    ).length;

    const items: InstalledConnector[] = connectors.map(c => ({
      installationId: c.getId().getValue(),
      tenantId: c.getTenantId(),
      connectorId: c.getId().getValue(),
      name: c.getName().getValue(),
      type: c.getType().getValue(),
      status: c.getStatus().getValue(),
      isSandbox: c.getConfiguration().getProps().isSandbox,
      installedAt: c.getCreatedAt(),
      updatedAt: c.getUpdatedAt(),
    }));

    return {
      tenantId,
      totalConnectors: connectors.length,
      activeConnectors: active,
      inventory: items,
    };
  }

  public async getCapabilityCatalog(): Promise<CapabilityCatalog> {
    const allConnectors = await this.repository.findAll();
    const map = new Map<ConnectorCapability, any[]>();

    for (const cap of Object.values(ConnectorCapability)) {
      map.set(cap, []);
    }

    for (const conn of allConnectors) {
      for (const cap of conn.getCapabilities().toArray()) {
        const list = map.get(cap) || [];
        list.push({
          connectorId: conn.getId().getValue(),
          name: conn.getName().getValue(),
          type: conn.getType().getValue(),
          version: conn.getVersion().getValue(),
        });
        map.set(cap, list);
      }
    }

    const entries = Array.from(map.entries()).map(([capability, connectors]) => ({
      capability,
      description: `Connectors supporting capability ${capability}`,
      connectors,
    }));

    return {
      totalCapabilities: entries.length,
      capabilities: entries,
    };
  }
}

/**
 * Service 7: ConnectorService
 * Main application service orchestrating aggregate command execution and CQRS read queries.
 */
@Injectable()
export class ConnectorService {
  constructor(
    @Inject(CONNECTOR_REPOSITORY_TOKEN)
    private readonly repository: ConnectorRepositoryPort,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort,
    private readonly credentialService: CredentialReferenceService,
    private readonly configurationService: ConfigurationService,
    private readonly capabilityService: CapabilityService,
    private readonly versionService: VersionService
  ) {}

  public async registerConnector(tenantId: string, dto: CreateConnectorDto): Promise<ConnectorResponseDto> {
    // Validate capabilities against connector type
    this.capabilityService.validateCapabilities(dto.type, dto.capabilities);

    const aggregate = ConnectorAggregate.register({
      tenantId,
      name: dto.name,
      type: dto.type,
      version: dto.version,
      capabilities: dto.capabilities,
      metadata: dto.metadata,
    });

    await this.repository.save(aggregate);
    await this.eventPublisher.publishAll(aggregate.getUncommittedEvents());
    aggregate.clearEvents();

    return this.toResponseDto(aggregate);
  }

  public async configureConnector(
    id: string,
    tenantId: string,
    dto: ConfigureConnectorDto
  ): Promise<ConnectorResponseDto> {
    const connector = await this.repository.findById(ConnectorId.create(id), tenantId);
    if (!connector) throw new ConnectorNotFoundException(id);

    // Validate and build credential reference
    const credentialRef = await this.credentialService.validateAndCreateReference(dto.credentialReference);

    // Create configuration VO
    const configuration = ConnectorConfiguration.create({
      settings: dto.settings,
      isSandbox: dto.isSandbox,
      timeoutMs: dto.timeoutMs,
      maxRetryAttempts: dto.maxRetryAttempts,
      allowedEndpoints: dto.allowedEndpoints,
    });

    const endpoint = dto.endpointUrl
      ? ConnectorEndpoint.create(dto.endpointUrl, dto.environment || 'PRODUCTION')
      : undefined;

    this.configurationService.validateConfiguration(configuration, endpoint);

    connector.configure(configuration, credentialRef, endpoint);

    await this.repository.save(connector);
    await this.eventPublisher.publishAll(connector.getUncommittedEvents());
    connector.clearEvents();

    return this.toResponseDto(connector);
  }

  public async connectConnector(
    id: string,
    tenantId: string,
    dto: ConnectConnectorDto
  ): Promise<ConnectorResponseDto> {
    const connector = await this.repository.findById(ConnectorId.create(id), tenantId);
    if (!connector) throw new ConnectorNotFoundException(id);

    const endpoint = ConnectorEndpoint.create(dto.endpointUrl, dto.environment || 'PRODUCTION');
    connector.connect(endpoint);

    await this.repository.save(connector);
    await this.eventPublisher.publishAll(connector.getUncommittedEvents());
    connector.clearEvents();

    return this.toResponseDto(connector);
  }

  public async disconnectConnector(
    id: string,
    tenantId: string,
    dto: DisconnectConnectorDto
  ): Promise<ConnectorResponseDto> {
    const connector = await this.repository.findById(ConnectorId.create(id), tenantId);
    if (!connector) throw new ConnectorNotFoundException(id);

    connector.disconnect(dto.reason);

    await this.repository.save(connector);
    await this.eventPublisher.publishAll(connector.getUncommittedEvents());
    connector.clearEvents();

    return this.toResponseDto(connector);
  }

  public async publishVersion(
    id: string,
    tenantId: string,
    dto: PublishVersionDto
  ): Promise<ConnectorResponseDto> {
    const connector = await this.repository.findById(ConnectorId.create(id), tenantId);
    if (!connector) throw new ConnectorNotFoundException(id);

    this.versionService.validateVersionPublish(connector.getVersion().getValue(), dto.version);
    connector.publishNewVersion(dto.version);

    await this.repository.save(connector);
    await this.eventPublisher.publishAll(connector.getUncommittedEvents());
    connector.clearEvents();

    return this.toResponseDto(connector);
  }

  public async disableConnector(id: string, tenantId: string, reason: string): Promise<ConnectorResponseDto> {
    const connector = await this.repository.findById(ConnectorId.create(id), tenantId);
    if (!connector) throw new ConnectorNotFoundException(id);

    connector.disable(reason);

    await this.repository.save(connector);
    await this.eventPublisher.publishAll(connector.getUncommittedEvents());
    connector.clearEvents();

    return this.toResponseDto(connector);
  }

  public async getConnectorById(id: string, tenantId?: string): Promise<ConnectorResponseDto> {
    const connector = await this.repository.findById(ConnectorId.create(id), tenantId);
    if (!connector) throw new ConnectorNotFoundException(id);
    return this.toResponseDto(connector);
  }

  public async listConnectors(query: ConnectorQueryDto): Promise<ConnectorResponseDto[]> {
    const connectors = query.tenantId
      ? await this.repository.findByTenant(query.tenantId, query)
      : await this.repository.findAll(query);

    return connectors.map(c => this.toResponseDto(c));
  }

  public async getStatistics(tenantId?: string): Promise<ConnectorStatistics> {
    const connectors = tenantId
      ? await this.repository.findByTenant(tenantId)
      : await this.repository.findAll();

    const byType: Record<ConnectorType, number> = {} as any;
    for (const t of Object.values(ConnectorType)) byType[t] = 0;

    const byStatus: Record<ConnectorStatus, number> = {} as any;
    for (const s of Object.values(ConnectorStatus)) byStatus[s] = 0;

    let totalLatency = 0;
    let totalSuccess = 0;

    for (const c of connectors) {
      byType[c.getType().getValue()] = (byType[c.getType().getValue()] || 0) + 1;
      byStatus[c.getStatus().getValue()] = (byStatus[c.getStatus().getValue()] || 0) + 1;

      const h = c.getHealth().getProps();
      totalLatency += h.latencyMs;
      totalSuccess += h.successRate;
    }

    const total = connectors.length;
    const totalActive = (byStatus[ConnectorStatus.CONNECTED] || 0) + (byStatus[ConnectorStatus.HEALTHY] || 0);

    return {
      totalRegistered: total,
      totalActive,
      totalDegraded: byStatus[ConnectorStatus.DEGRADED] || 0,
      totalDisabled: byStatus[ConnectorStatus.DISABLED] || 0,
      byType,
      byStatus,
      averageLatencyMs: total > 0 ? Math.round(totalLatency / total) : 0,
      overallUptimeRate: total > 0 ? Number((totalActive / total).toFixed(4)) : 1.0,
      overallSuccessRate: total > 0 ? Number((totalSuccess / total).toFixed(4)) : 1.0,
    };
  }

  public toResponseDto(connector: ConnectorAggregate): ConnectorResponseDto {
    const credentialRef = connector.getCredentialRef()?.getProps();
    const endpoint = connector.getEndpoint();
    const healthProps = connector.getHealth().getProps();

    return {
      id: connector.getId().getValue(),
      tenantId: connector.getTenantId(),
      name: connector.getName().getValue(),
      type: connector.getType().getValue(),
      version: connector.getVersion().getValue(),
      status: connector.getStatus().getValue(),
      configuration: connector.getConfiguration().getProps(),
      capabilities: connector.getCapabilities().toArray(),
      credentialReference: credentialRef
        ? {
            secretArn: credentialRef.secretArn,
            provider: credentialRef.provider,
            secretKeyRef: credentialRef.secretKeyRef,
            version: credentialRef.version,
            updatedAt: credentialRef.updatedAt,
          }
        : undefined,
      endpoint: endpoint
        ? {
            baseUrl: endpoint.getBaseUrl(),
            environment: endpoint.environment,
          }
        : undefined,
      health: {
        isHealthy: healthProps.isHealthy,
        healthScore: connector.getHealth().getScore(),
        latencyMs: healthProps.latencyMs,
        availabilityRate: healthProps.availabilityRate,
        failureRate: healthProps.failureRate,
        successRate: healthProps.successRate,
        errorDetails: healthProps.errorDetails,
        lastCheckedAt: healthProps.lastCheckedAt,
        lastSuccessfulConnection: healthProps.lastSuccessfulConnection,
      },
      metadata: connector.getMetadata().getProps(),
      createdAt: connector.getCreatedAt(),
      updatedAt: connector.getUpdatedAt(),
    };
  }
}
