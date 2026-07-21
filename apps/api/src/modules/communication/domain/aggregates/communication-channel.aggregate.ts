import { AggregateRoot } from '@saas/core';
import { ChannelTypeEnum } from '../value-objects/notification-channel-type.value-object';
import {
  CommunicationChannelEnabled,
  CommunicationChannelDisabled,
} from '../events/communication-events';

export interface CommunicationChannelProps {
  id: string; // The aggregate ID
  type: ChannelTypeEnum;
  name: string;
  isEnabled: boolean;
  providerName?: string;
  isSystemRequired: boolean; // Indicates if workflows depend on this channel
}

export class CommunicationChannel extends AggregateRoot<CommunicationChannelProps> {
  private constructor(props: CommunicationChannelProps) {
    super(props.id, props);
  }

  public static create(
    id: string,
    type: ChannelTypeEnum,
    name: string,
    providerName?: string,
    isSystemRequired: boolean = false
  ): CommunicationChannel {
    if (!name || name.trim().length === 0) {
      throw new Error('Channel name cannot be empty');
    }

    return new CommunicationChannel({
      id,
      type,
      name,
      providerName,
      isEnabled: false,
      isSystemRequired,
    });
  }

  get channelId(): string { return this.props.id; }
  get type(): ChannelTypeEnum { return this.props.type; }
  get name(): string { return this.props.name; }
  get isEnabled(): boolean { return this.props.isEnabled; }
  get providerName(): string | undefined { return this.props.providerName; }
  get isSystemRequired(): boolean { return this.props.isSystemRequired; }

  public enable(): void {
    if (this.props.isEnabled) return;
    
    this.props.isEnabled = true;
    this.addDomainEvent(new CommunicationChannelEnabled(this.id));
  }

  public disable(): void {
    if (!this.props.isEnabled) return;
    
    if (this.props.isSystemRequired) {
      throw new Error('Cannot disable a communication channel that is currently required by active workflows');
    }

    this.props.isEnabled = false;
    this.addDomainEvent(new CommunicationChannelDisabled(this.id));
  }

  public markAsSystemRequired(): void {
    this.props.isSystemRequired = true;
  }

  public clearSystemRequired(): void {
    this.props.isSystemRequired = false;
  }
}
