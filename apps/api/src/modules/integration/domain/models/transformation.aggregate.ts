/**
 * Enterprise Data Transformation Platform - Transformation Aggregate Root
 *
 * Implements aggregate root managing mapping rules, schema validation, and status lifecycle.
 * STRICT RULE: Mappings are IMMUTABLE after publication. Modifying a published mapping throws ImmutableMappingException.
 */

import { TransformationStatus, TransformationType } from '../enums/transformation.enums';
import {
  TransformationId,
  TransformationVersion,
  MappingDefinition,
  SchemaDefinition,
  ValidationResult,
  MappingRule,
} from '../value-objects/transformation-vo';
import { BaseDomainEvent } from '../events/connector.events';
import {
  TransformationCreatedEvent,
  TransformationValidatedEvent,
  TransformationPublishedEvent,
  MappingVersionPublishedEvent,
  TransformationFailedEvent,
} from '../events/transformation.events';
import { ImmutableMappingException, MappingExecutionException } from '../exceptions/transformation.exceptions';

export interface TransformationAggregateProps {
  id: TransformationId;
  tenantId: string;
  name: string;
  type: TransformationType;
  version: TransformationVersion;
  status: TransformationStatus;
  sourceSchema?: SchemaDefinition;
  targetSchema?: SchemaDefinition;
  mapping: MappingDefinition;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TransformationAggregate {
  private domainEvents: BaseDomainEvent[] = [];

  private constructor(private props: TransformationAggregateProps) {}

  public static create(params: {
    id?: TransformationId;
    tenantId?: string;
    name: string;
    type?: TransformationType;
    version?: string;
    description?: string;
    rules?: MappingRule[];
  }): TransformationAggregate {
    const id = params.id || TransformationId.generate();
    const tenantId = params.tenantId || 'tenant-default';
    const type = params.type || TransformationType.INBOUND_MAPPING;
    const version = TransformationVersion.create(params.version || '1.0.0');
    const mapping = MappingDefinition.create(params.rules || []);

    const now = new Date();
    const aggregate = new TransformationAggregate({
      id,
      tenantId,
      name: params.name,
      type,
      version,
      status: TransformationStatus.DRAFT,
      mapping,
      description: params.description || '',
      createdAt: now,
      updatedAt: now,
    });

    aggregate.addDomainEvent(
      new TransformationCreatedEvent(id.getValue(), tenantId, params.name, type, version.getValue(), now)
    );

    return aggregate;
  }

  // --- Getters ---
  public getId(): TransformationId { return this.props.id; }
  public getTenantId(): string { return this.props.tenantId; }
  public getName(): string { return this.props.name; }
  public getType(): TransformationType { return this.props.type; }
  public getVersion(): TransformationVersion { return this.props.version; }
  public getStatus(): TransformationStatus { return this.props.status; }
  public getMapping(): MappingDefinition { return this.props.mapping; }
  public getSourceSchema(): SchemaDefinition | undefined { return this.props.sourceSchema; }
  public getTargetSchema(): SchemaDefinition | undefined { return this.props.targetSchema; }
  public getDescription(): string { return this.props.description; }
  public getCreatedAt(): Date { return this.props.createdAt; }
  public getUpdatedAt(): Date { return this.props.updatedAt; }

  public getUncommittedEvents(): BaseDomainEvent[] { return [...this.domainEvents]; }
  public clearEvents(): void { this.domainEvents = []; }

  private addDomainEvent(event: BaseDomainEvent): void { this.domainEvents.push(event); }

  /**
   * Update mapping rules.
   * Throws ImmutableMappingException if state is PUBLISHED.
   */
  public updateRules(rules: MappingRule[]): void {
    if (this.props.status === TransformationStatus.PUBLISHED) {
      throw new ImmutableMappingException(this.getId().getValue(), this.getVersion().getValue());
    }

    this.props.mapping = MappingDefinition.create(rules);
    this.props.updatedAt = new Date();
  }

  public validateTransformation(): ValidationResult {
    const rules = this.props.mapping.getRules();
    const errors: string[] = [];

    if (rules.length === 0) {
      errors.push('Transformation must contain at least one MappingRule');
    }

    const isValid = errors.length === 0;
    const now = new Date();

    if (isValid && this.props.status === TransformationStatus.DRAFT) {
      this.props.status = TransformationStatus.VALIDATED;
    }

    this.props.updatedAt = now;
    this.addDomainEvent(
      new TransformationValidatedEvent(this.getId().getValue(), this.getTenantId(), isValid, rules.length, now)
    );

    return isValid ? ValidationResult.valid() : ValidationResult.invalid(errors);
  }

  /**
   * Publish transformation definition.
   * Once published, mapping rules become immutable.
   */
  public publish(): void {
    const validation = this.validateTransformation();
    if (!validation.isValid) {
      throw new MappingExecutionException(`Cannot publish invalid transformation: ${validation.errors.join(', ')}`);
    }

    const now = new Date();
    this.props.status = TransformationStatus.PUBLISHED;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new TransformationPublishedEvent(this.getId().getValue(), this.getTenantId(), this.getVersion().getValue(), now)
    );
  }

  /**
   * Publish a new SemVer version for an updated mapping definition.
   */
  public publishNewVersion(newVersionStr: string, newRules: MappingRule[]): TransformationAggregate {
    const prevVersion = this.getVersion().getValue();
    const newVer = TransformationVersion.create(newVersionStr);

    const newAggregate = TransformationAggregate.create({
      tenantId: this.getTenantId(),
      name: this.getName(),
      type: this.getType(),
      version: newVer.getValue(),
      description: this.getDescription(),
      rules: newRules,
    });

    newAggregate.publish();

    this.addDomainEvent(
      new MappingVersionPublishedEvent(this.getId().getValue(), this.getTenantId(), newVer.getValue(), prevVersion, new Date())
    );

    return newAggregate;
  }
}
