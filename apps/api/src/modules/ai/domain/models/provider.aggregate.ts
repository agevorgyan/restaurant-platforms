/**
 * Enterprise AI Gateway - Provider Aggregate Root
 *
 * Manages AI provider configuration, model capabilities, health status machine,
 * and failover priority ranking.
 */

import { ProviderType, ProviderStatus, ModelType } from '../enums/ai.enums';
import { ProviderId, ProviderName, ModelId } from '../value-objects/ai-vo';
import { BaseDomainEvent } from '../events/ai.events';
import { ProviderRegisteredEvent, ProviderHealthChangedEvent } from '../events/ai.events';

export interface ProviderAggregateProps {
  id: ProviderId;
  tenantId: string;
  name: ProviderName;
  type: ProviderType;
  status: ProviderStatus;
  supportedModels: ModelId[];
  supportedCapabilities: ModelType[];
  priority: number; // Lower is higher priority (e.g. 1 = primary, 2 = fallback)
  credentialArn: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ProviderAggregate {
  private domainEvents: BaseDomainEvent[] = [];

  private constructor(private props: ProviderAggregateProps) {}

  public static register(params: {
    id?: ProviderId;
    tenantId?: string;
    name: string;
    type: ProviderType;
    supportedModels?: string[];
    supportedCapabilities?: ModelType[];
    priority?: number;
    credentialArn?: string;
  }): ProviderAggregate {
    const id = params.id || ProviderId.generate();
    const tenantId = params.tenantId || 'tenant-default';
    const name = ProviderName.create(params.name);
    const models = (params.supportedModels || ['gpt-4o']).map(m => ModelId.create(m));
    const capabilities = params.supportedCapabilities || [ModelType.CHAT, ModelType.COMPLETION];
    const priority = params.priority ?? 1;
    const credentialArn = params.credentialArn || `vault://credentials/ai/${params.type.toLowerCase()}`;

    const now = new Date();
    const aggregate = new ProviderAggregate({
      id,
      tenantId,
      name,
      type: params.type,
      status: ProviderStatus.HEALTHY,
      supportedModels: models,
      supportedCapabilities: capabilities,
      priority,
      credentialArn,
      createdAt: now,
      updatedAt: now,
    });

    aggregate.addDomainEvent(
      new ProviderRegisteredEvent(id.getValue(), tenantId, params.name, params.type, now)
    );

    return aggregate;
  }

  // --- Getters ---
  public getId(): ProviderId { return this.props.id; }
  public getTenantId(): string { return this.props.tenantId; }
  public getName(): ProviderName { return this.props.name; }
  public getType(): ProviderType { return this.props.type; }
  public getStatus(): ProviderStatus { return this.props.status; }
  public getSupportedModels(): ModelId[] { return [...this.props.supportedModels]; }
  public getSupportedCapabilities(): ModelType[] { return [...this.props.supportedCapabilities]; }
  public getPriority(): number { return this.props.priority; }
  public getCredentialArn(): string { return this.props.credentialArn; }
  public getCreatedAt(): Date { return this.props.createdAt; }
  public getUpdatedAt(): Date { return this.props.updatedAt; }

  public getUncommittedEvents(): BaseDomainEvent[] { return [...this.domainEvents]; }
  public clearEvents(): void { this.domainEvents = []; }

  private addDomainEvent(event: BaseDomainEvent): void { this.domainEvents.push(event); }

  public updateStatus(newStatus: ProviderStatus): void {
    if (this.props.status === newStatus) return;

    const oldStatus = this.props.status;
    const now = new Date();
    this.props.status = newStatus;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new ProviderHealthChangedEvent(this.getId().getValue(), this.getTenantId(), this.getType(), oldStatus, newStatus, now)
    );
  }

  public supportsModel(modelIdStr: string): boolean {
    return this.props.supportedModels.some(m => m.getValue().toLowerCase() === modelIdStr.toLowerCase());
  }

  public supportsCapability(capability: ModelType): boolean {
    return this.props.supportedCapabilities.includes(capability);
  }
}
