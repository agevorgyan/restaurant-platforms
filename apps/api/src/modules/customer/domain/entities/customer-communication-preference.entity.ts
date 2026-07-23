import { Entity } from '@saas/core';
import { CommunicationChannel } from '../value-objects/communication-channel.value-object';

export interface CustomerCommunicationPreferenceProps {
  channel: CommunicationChannel;
  isEnabled: boolean;
}

export class CustomerCommunicationPreference extends Entity<CustomerCommunicationPreferenceProps> {
  get channel(): CommunicationChannel { return this.props.channel; }
  private constructor(id: string, props: CustomerCommunicationPreferenceProps) { super(id, props); }
  public static create(id: string, props: CustomerCommunicationPreferenceProps): CustomerCommunicationPreference {
    return new CustomerCommunicationPreference(id, props);
  }
}