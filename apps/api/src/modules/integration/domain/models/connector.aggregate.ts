/**
 * Enterprise Connector Platform - Connector Aggregate Root
 *
 * Implements Domain-Driven Design (DDD) aggregate root managing
 * connector lifecycle, state transitions, health evaluation, and domain event emission.
 */

import { randomUUID, createHash } from 'crypto';
import { ConnectorStatus, ConnectorCapability } from '../enums/connector.enums';
import {
  ConnectorId,
  ConnectorVersion,
  ConnectorName,
  ConnectorTypeVO,
  ConnectorConfiguration,
  ConnectorCapabilityVO,
  ConnectorCredentialReference,
  ConnectorEndpoint,
  ConnectorHealth,
  ConnectorStatusVO,
  ConnectorMetadata,
  HealthScore,
} from '../value-objects/connector-vo';
import {
  BaseDomainEvent,
  ConnectorRegisteredEvent,
  ConnectorConfiguredEvent,
  ConnectorConnectedEvent,
  ConnectorDisconnectedEvent,
  ConnectorHealthChangedEvent,
  ConnectorVersionPublishedEvent,
  ConnectorDisabledEvent,
  HealthCheckCompletedEvent,
} from '../events/connector.events';
import { InvalidConfigurationException, VersionMismatchException } from '../exceptions/connector.exceptions';

export interface ConnectorAggregateProps {
  id: ConnectorId;
  tenantId: string;
  name: ConnectorName;
  type: ConnectorTypeVO;
  version: ConnectorVersion;
  status: ConnectorStatusVO;
  configuration: ConnectorConfiguration;
  capabilities: ConnectorCapabilityVO;
  credentialRef?: ConnectorCredentialReference;
  endpoint?: ConnectorEndpoint;
  health: ConnectorHealth;
  metadata: ConnectorMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export class ConnectorAggregate {
  private domainEvents: BaseDomainEvent[] = [];

  private constructor(private props: ConnectorAggregateProps) {}

  /**
   * Factory method to register a new connector in DRAFT state.
   */
  public static register(params: {
    id?: ConnectorId;
    tenantId: string;
    name: string;
    type: string;
    version: string;
    capabilities: (ConnectorCapability | string)[];
    metadata: {
      description: string;
      provider: string;
      license: string;
      documentationUrl?: string;
      tags?: string[];
      signature?: string;
    };
  }): ConnectorAggregate {
    if (!params.tenantId || params.tenantId.trim().length === 0) {
      throw new InvalidConfigurationException('Tenant ID is mandatory for connector registration.');
    }

    const id = params.id || ConnectorId.generate();
    const name = ConnectorName.create(params.name);
    const type = ConnectorTypeVO.create(params.type);
    const version = ConnectorVersion.create(params.version);
    const status = ConnectorStatusVO.create(ConnectorStatus.DRAFT);
    const configuration = ConnectorConfiguration.create({});
    const capabilities = ConnectorCapabilityVO.create(params.capabilities);
    const health = ConnectorHealth.initial();
    const metadata = ConnectorMetadata.create({
      description: params.metadata.description,
      provider: params.metadata.provider,
      license: params.metadata.license,
      documentationUrl: params.metadata.documentationUrl,
      tags: params.metadata.tags || [],
      signature: params.metadata.signature,
      signedAt: params.metadata.signature ? new Date() : undefined,
    });

    const now = new Date();
    const aggregate = new ConnectorAggregate({
      id,
      tenantId: params.tenantId,
      name,
      type,
      version,
      status,
      configuration,
      capabilities,
      health,
      metadata,
      createdAt: now,
      updatedAt: now,
    });

    aggregate.addDomainEvent(
      new ConnectorRegisteredEvent(
        id.getValue(),
        params.tenantId,
        name.getValue(),
        type.getValue(),
        version.getValue(),
        now
      )
    );

    return aggregate;
  }

  /**
   * Reconstitute an aggregate from persistent storage.
   */
  public static reconstitute(props: ConnectorAggregateProps): ConnectorAggregate {
    return new ConnectorAggregate(props);
  }

  // --- Getters ---
  public getId(): ConnectorId { return this.props.id; }
  public getTenantId(): string { return this.props.tenantId; }
  public getName(): ConnectorName { return this.props.name; }
  public getType(): ConnectorTypeVO { return this.props.type; }
  public getVersion(): ConnectorVersion { return this.props.version; }
  public getStatus(): ConnectorStatusVO { return this.props.status; }
  public getConfiguration(): ConnectorConfiguration { return this.props.configuration; }
  public getCapabilities(): ConnectorCapabilityVO { return this.props.capabilities; }
  public getCredentialRef(): ConnectorCredentialReference | undefined { return this.props.credentialRef; }
  public getEndpoint(): ConnectorEndpoint | undefined { return this.props.endpoint; }
  public getHealth(): ConnectorHealth { return this.props.health; }
  public getMetadata(): ConnectorMetadata { return this.props.metadata; }
  public getCreatedAt(): Date { return this.props.createdAt; }
  public getUpdatedAt(): Date { return this.props.updatedAt; }

  // --- Domain Event Queue ---
  public getUncommittedEvents(): BaseDomainEvent[] {
    return [...this.domainEvents];
  }

  public clearEvents(): void {
    this.domainEvents = [];
  }

  private addDomainEvent(event: BaseDomainEvent): void {
    this.domainEvents.push(event);
  }

  // --- Domain Behaviors & Lifecycle State Transitions ---

  /**
   * Configure connector settings, credential reference, and optional endpoint.
   * Transitions state from DRAFT -> CONFIGURED.
   */
  public configure(
    configuration: ConnectorConfiguration,
    credentialRef: ConnectorCredentialReference,
    endpoint?: ConnectorEndpoint
  ): void {
    const nextStatus = this.props.status.transitionTo(ConnectorStatus.CONFIGURED, 'Connector configured with credentials');
    
    this.props.configuration = configuration;
    this.props.credentialRef = credentialRef;
    if (endpoint) {
      this.props.endpoint = endpoint;
    }
    this.props.status = nextStatus;
    this.props.updatedAt = new Date();

    const configHash = createHash('sha256').update(JSON.stringify(configuration.getSettings())).digest('hex');
    this.addDomainEvent(
      new ConnectorConfiguredEvent(
        this.getId().getValue(),
        this.getTenantId(),
        configHash,
        credentialRef.getSecretArn(),
        this.props.endpoint?.getBaseUrl() || '',
        this.props.updatedAt
      )
    );
  }

  /**
   * Connect connector instance to target external system endpoint.
   * Transitions state from CONFIGURED / DISCONNECTED -> CONNECTED.
   */
  public connect(endpoint: ConnectorEndpoint): void {
    if (!this.props.credentialRef) {
      throw new InvalidConfigurationException('Cannot connect a connector without a valid ConnectorCredentialReference');
    }

    const nextStatus = this.props.status.transitionTo(ConnectorStatus.CONNECTED, 'Connector endpoint validation successful');
    this.props.endpoint = endpoint;
    this.props.status = nextStatus;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new ConnectorConnectedEvent(
        this.getId().getValue(),
        this.getTenantId(),
        endpoint.getBaseUrl(),
        this.props.updatedAt
      )
    );
  }

  /**
   * Disconnect connector instance.
   * Transitions state to DISCONNECTED.
   */
  public disconnect(reason: string): void {
    const nextStatus = this.props.status.transitionTo(ConnectorStatus.DISCONNECTED, reason);
    this.props.status = nextStatus;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new ConnectorDisconnectedEvent(
        this.getId().getValue(),
        this.getTenantId(),
        reason,
        this.props.updatedAt
      )
    );
  }

  /**
   * Record health check execution result and recalculate health score & status.
   */
  public recordHealthCheck(latencyMs: number, success: boolean, errorDetails?: string): void {
    const prevStatus = this.props.status.getValue();
    const prevHealth = this.props.health.getProps();

    // Compute metrics
    const totalChecks = 100; // Moving window sample size
    const newSuccessRate = success ? Math.min(1.0, prevHealth.successRate * 0.9 + 0.1) : prevHealth.successRate * 0.9;
    const newFailureRate = 1.0 - newSuccessRate;
    const newAvailability = newSuccessRate;

    const healthScore = HealthScore.compute(latencyMs, newSuccessRate, newFailureRate);
    const scoreVal = healthScore.getValue();
    const isHealthy = success && !healthScore.isUnhealthy();

    let targetStatus: ConnectorStatus = this.props.status.getValue();
    if (this.props.status.getValue() === ConnectorStatus.CONNECTED || this.props.status.getValue() === ConnectorStatus.HEALTHY || this.props.status.getValue() === ConnectorStatus.DEGRADED) {
      if (!isHealthy || healthScore.isUnhealthy()) {
        targetStatus = ConnectorStatus.DEGRADED;
      } else if (healthScore.isDegraded()) {
        targetStatus = ConnectorStatus.DEGRADED;
      } else {
        targetStatus = ConnectorStatus.HEALTHY;
      }
    }

    const now = new Date();
    this.props.health = ConnectorHealth.create({
      isHealthy,
      healthScore,
      latencyMs,
      availabilityRate: newAvailability,
      failureRate: newFailureRate,
      successRate: newSuccessRate,
      errorDetails: success ? undefined : errorDetails,
      lastCheckedAt: now,
      lastSuccessfulConnection: success ? now : prevHealth.lastSuccessfulConnection,
    });

    if (targetStatus !== prevStatus && this.props.status.canTransitionTo(targetStatus)) {
      this.props.status = this.props.status.transitionTo(targetStatus, `Health score changed to ${scoreVal}`);
      
      this.addDomainEvent(
        new ConnectorHealthChangedEvent(
          this.getId().getValue(),
          this.getTenantId(),
          prevStatus,
          targetStatus,
          scoreVal,
          isHealthy,
          now
        )
      );
    }

    this.addDomainEvent(
      new HealthCheckCompletedEvent(
        this.getId().getValue(),
        this.getTenantId(),
        this.props.status.getValue(),
        scoreVal,
        latencyMs,
        success,
        now
      )
    );

    this.props.updatedAt = now;
  }

  /**
   * Publish new SemVer version for connector.
   */
  public publishNewVersion(newVersionStr: string): void {
    const newVer = ConnectorVersion.create(newVersionStr);
    if (!newVer.isGreaterThan(this.props.version)) {
      throw new VersionMismatchException(
        `New version '${newVersionStr}' must be strictly greater than current version '${this.props.version.getValue()}'`
      );
    }

    const prevVersionStr = this.props.version.getValue();
    this.props.version = newVer;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new ConnectorVersionPublishedEvent(
        this.getId().getValue(),
        this.getTenantId(),
        newVer.getValue(),
        prevVersionStr,
        this.props.updatedAt
      )
    );
  }

  /**
   * Disable connector instance due to policy or administrative action.
   */
  public disable(reason: string): void {
    const nextStatus = this.props.status.transitionTo(ConnectorStatus.DISABLED, reason);
    this.props.status = nextStatus;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new ConnectorDisabledEvent(
        this.getId().getValue(),
        this.getTenantId(),
        reason,
        this.props.updatedAt
      )
    );
  }

  /**
   * Archive connector instance permanently.
   */
  public archive(): void {
    const nextStatus = this.props.status.transitionTo(ConnectorStatus.ARCHIVED, 'Archived by tenant');
    this.props.status = nextStatus;
    this.props.updatedAt = new Date();
  }
}
