/**
 * Enterprise Distributed Configuration Platform - Domain Aggregate Root
 *
 * ConfigurationAggregate encapsulates centralized configuration metadata, dot-separated keys,
 * strongly-typed value containers, namespaces, environment isolation, semantic versioning (Major.Minor.Revision),
 * status lifecycle (DRAFT -> VALIDATED -> PUBLISHED -> DEPRECATED -> ARCHIVED), SHA-256 checksums,
 * immutability rules, rollback engines, and domain event publishing.
 */

import {
  ConfigurationStatus,
  ConfigurationType,
  EnvironmentType,
  PropagationStatus,
} from '../enums/config.enums';
import {
  ConfigurationChecksum,
  ConfigurationId,
  ConfigurationKey,
  ConfigurationNamespace,
  ConfigurationRevision,
  ConfigurationScope,
  ConfigurationValue,
  ConfigurationVersion,
} from '../value-objects/config-vo';
import { BasePlatformDomainEvent } from '../events/health.events';
import {
  ConfigurationArchivedEvent,
  ConfigurationCreatedEvent,
  ConfigurationPublishedEvent,
  ConfigurationPropagatedEvent,
  ConfigurationRolledBackEvent,
  ConfigurationValidatedEvent,
} from '../events/config.events';
import { ImmutableConfigurationException } from '../exceptions/config.exceptions';

export interface CreateConfigurationProps {
  key: string;
  value: unknown;
  configType: ConfigurationType;
  environment: EnvironmentType;
  tenantId: string;
  namespace?: string;
  scope?: ConfigurationScope;
  schema?: Record<string, unknown>;
  description?: string;
  tags?: string[];
  createdBy?: string;
}

export class ConfigurationAggregate {
  private readonly id: ConfigurationId;
  private readonly tenantId: string;
  private key: ConfigurationKey;
  private value: ConfigurationValue;
  private namespace: ConfigurationNamespace;
  private configType: ConfigurationType;
  private environment: EnvironmentType;
  private status: ConfigurationStatus;
  private propagationStatus: PropagationStatus;
  private version: ConfigurationVersion;
  private revision: ConfigurationRevision;
  private checksum: ConfigurationChecksum;
  private scope: ConfigurationScope;
  private schema: Record<string, unknown>;
  private signature?: string;
  private description?: string;
  private tags: string[];
  private createdBy: string;
  private updatedBy: string;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private uncommittedEvents: BasePlatformDomainEvent[] = [];

  private constructor(props: {
    id: ConfigurationId;
    tenantId: string;
    key: ConfigurationKey;
    value: ConfigurationValue;
    namespace: ConfigurationNamespace;
    configType: ConfigurationType;
    environment: EnvironmentType;
    status: ConfigurationStatus;
    propagationStatus?: PropagationStatus;
    version: ConfigurationVersion;
    revision: ConfigurationRevision;
    checksum: ConfigurationChecksum;
    scope: ConfigurationScope;
    schema?: Record<string, unknown>;
    signature?: string;
    description?: string;
    tags?: string[];
    createdBy?: string;
    updatedBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.key = props.key;
    this.value = props.value;
    this.namespace = props.namespace;
    this.configType = props.configType;
    this.environment = props.environment;
    this.status = props.status;
    this.propagationStatus = props.propagationStatus || PropagationStatus.PENDING;
    this.version = props.version;
    this.revision = props.revision;
    this.checksum = props.checksum;
    this.scope = props.scope;
    this.schema = props.schema || {};
    this.signature = props.signature;
    this.description = props.description;
    this.tags = props.tags || [];
    this.createdBy = props.createdBy || 'system';
    this.updatedBy = props.updatedBy || props.createdBy || 'system';
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  /**
   * Factory method to create a new Configuration Aggregate in DRAFT status
   */
  public static create(props: CreateConfigurationProps): ConfigurationAggregate {
    const id = ConfigurationId.create();
    const key = ConfigurationKey.create(props.key);
    const value = ConfigurationValue.create(props.value);
    const namespace = ConfigurationNamespace.create(props.namespace || key.getNamespace());
    const version = ConfigurationVersion.initial();
    const revision = ConfigurationRevision.create(1);
    const checksum = ConfigurationChecksum.compute(props.value);
    const scope = props.scope || ConfigurationScope.tenant(props.tenantId);

    const aggregate = new ConfigurationAggregate({
      id,
      tenantId: props.tenantId,
      key,
      value,
      namespace,
      configType: props.configType,
      environment: props.environment,
      status: ConfigurationStatus.DRAFT,
      version,
      revision,
      checksum,
      scope,
      schema: props.schema,
      description: props.description,
      tags: props.tags,
      createdBy: props.createdBy,
    });

    aggregate.addDomainEvent(
      new ConfigurationCreatedEvent(
        id.getValue(),
        props.tenantId,
        key.getValue(),
        props.configType,
        props.environment,
        version.toString()
      )
    );

    return aggregate;
  }

  /**
   * Reconstitute aggregate from persistent storage
   */
  public static reconstitute(props: {
    id: ConfigurationId;
    tenantId: string;
    key: ConfigurationKey;
    value: ConfigurationValue;
    namespace: ConfigurationNamespace;
    configType: ConfigurationType;
    environment: EnvironmentType;
    status: ConfigurationStatus;
    propagationStatus: PropagationStatus;
    version: ConfigurationVersion;
    revision: ConfigurationRevision;
    checksum: ConfigurationChecksum;
    scope: ConfigurationScope;
    schema: Record<string, unknown>;
    signature?: string;
    description?: string;
    tags: string[];
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
  }): ConfigurationAggregate {
    return new ConfigurationAggregate(props);
  }

  // Getters
  public getId(): ConfigurationId {
    return this.id;
  }

  public getTenantId(): string {
    return this.tenantId;
  }

  public getKey(): ConfigurationKey {
    return this.key;
  }

  public getValue(): ConfigurationValue {
    return this.value;
  }

  public getNamespace(): ConfigurationNamespace {
    return this.namespace;
  }

  public getConfigType(): ConfigurationType {
    return this.configType;
  }

  public getEnvironment(): EnvironmentType {
    return this.environment;
  }

  public getStatus(): ConfigurationStatus {
    return this.status;
  }

  public getPropagationStatus(): PropagationStatus {
    return this.propagationStatus;
  }

  public getVersion(): ConfigurationVersion {
    return this.version;
  }

  public getRevision(): ConfigurationRevision {
    return this.revision;
  }

  public getChecksum(): ConfigurationChecksum {
    return this.checksum;
  }

  public getScope(): ConfigurationScope {
    return this.scope;
  }

  public getSchema(): Record<string, unknown> {
    return { ...this.schema };
  }

  public getSignature(): string | undefined {
    return this.signature;
  }

  public getDescription(): string | undefined {
    return this.description;
  }

  public getTags(): string[] {
    return [...this.tags];
  }

  public getCreatedBy(): string {
    return this.createdBy;
  }

  public getUpdatedBy(): string {
    return this.updatedBy;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Immutability Guard
  private assertMutable(): void {
    if (this.status === ConfigurationStatus.PUBLISHED) {
      throw new ImmutableConfigurationException(
        this.key.getValue(),
        this.version.toString()
      );
    }
  }

  // Aggregate Mutations & State Transitions
  public validateSchema(schema?: Record<string, unknown>, updatedBy: string = 'system'): void {
    this.assertMutable();
    if (schema) this.schema = schema;

    this.status = ConfigurationStatus.VALIDATED;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new ConfigurationValidatedEvent(
        this.id.getValue(),
        this.tenantId,
        this.checksum.getValue(),
        true
      )
    );
  }

  public publish(publishedBy: string = 'system'): void {
    if (this.status === ConfigurationStatus.PUBLISHED) return;

    this.status = ConfigurationStatus.PUBLISHED;
    this.signature = `sig-sha256-${this.checksum.getValue().substring(0, 12)}`;
    this.updatedBy = publishedBy;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new ConfigurationPublishedEvent(
        this.id.getValue(),
        this.tenantId,
        this.key.getValue(),
        this.version.toString(),
        this.checksum.getValue(),
        publishedBy
      )
    );
  }

  public createNextRevision(newValue: unknown, updatedBy: string = 'system'): ConfigurationAggregate {
    const nextVersion = this.version.incrementMinor();
    const nextRevision = ConfigurationRevision.create(this.revision.getValue() + 1);
    const newChecksum = ConfigurationChecksum.compute(newValue);

    const newDraft = new ConfigurationAggregate({
      id: ConfigurationId.create(),
      tenantId: this.tenantId,
      key: this.key,
      value: ConfigurationValue.create(newValue),
      namespace: this.namespace,
      configType: this.configType,
      environment: this.environment,
      status: ConfigurationStatus.DRAFT,
      propagationStatus: PropagationStatus.PENDING,
      version: nextVersion,
      revision: nextRevision,
      checksum: newChecksum,
      scope: this.scope,
      schema: this.schema,
      description: this.description,
      tags: [...this.tags],
      createdBy: updatedBy,
    });

    newDraft.addDomainEvent(
      new ConfigurationCreatedEvent(
        newDraft.getId().getValue(),
        this.tenantId,
        this.key.getValue(),
        this.configType,
        this.environment,
        nextVersion.toString()
      )
    );

    return newDraft;
  }

  public rollback(restoredValue: unknown, restoredVersionStr: string, rolledBackBy: string = 'system'): ConfigurationAggregate {
    const currentVersionStr = this.version.toString();
    const nextVersion = this.version.incrementRevision();
    const nextRevision = ConfigurationRevision.create(this.revision.getValue() + 1);
    const newChecksum = ConfigurationChecksum.compute(restoredValue);

    const rolledBackAggregate = new ConfigurationAggregate({
      id: ConfigurationId.create(),
      tenantId: this.tenantId,
      key: this.key,
      value: ConfigurationValue.create(restoredValue),
      namespace: this.namespace,
      configType: this.configType,
      environment: this.environment,
      status: ConfigurationStatus.PUBLISHED,
      propagationStatus: PropagationStatus.COMPLETED,
      version: nextVersion,
      revision: nextRevision,
      checksum: newChecksum,
      scope: this.scope,
      schema: this.schema,
      description: `Rollback to version ${restoredVersionStr}`,
      tags: [...this.tags, 'rollback'],
      createdBy: rolledBackBy,
    });

    rolledBackAggregate.addDomainEvent(
      new ConfigurationRolledBackEvent(
        rolledBackAggregate.getId().getValue(),
        this.tenantId,
        this.key.getValue(),
        currentVersionStr,
        restoredVersionStr,
        nextRevision.getValue()
      )
    );

    return rolledBackAggregate;
  }

  public setPropagationStatus(status: PropagationStatus, latencyMs: number = 10): void {
    this.propagationStatus = status;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new ConfigurationPropagatedEvent(
        this.id.getValue(),
        this.tenantId,
        this.environment,
        status,
        latencyMs
      )
    );
  }

  public archive(updatedBy: string = 'system'): void {
    this.status = ConfigurationStatus.ARCHIVED;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new ConfigurationArchivedEvent(
        this.id.getValue(),
        this.tenantId,
        this.key.getValue(),
        this.version.toString()
      )
    );
  }

  // Events Management
  private addDomainEvent(event: BasePlatformDomainEvent): void {
    this.uncommittedEvents.push(event);
  }

  public getUncommittedEvents(): BasePlatformDomainEvent[] {
    return [...this.uncommittedEvents];
  }

  public clearUncommittedEvents(): void {
    this.uncommittedEvents = [];
  }
}
