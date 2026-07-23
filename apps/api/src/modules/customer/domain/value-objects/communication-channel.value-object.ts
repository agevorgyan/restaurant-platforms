import { ValueObject } from '@saas/core';
import { ContactMethod } from '../enums/customer.enums';

export interface CommunicationChannelProps { channel: ContactMethod; }

export class CommunicationChannel extends ValueObject<CommunicationChannelProps> {
  get channel(): ContactMethod { return this.props.channel; }
  private constructor(props: CommunicationChannelProps) { super(props); }
  public static create(channel: ContactMethod): CommunicationChannel {
    return new CommunicationChannel({ channel });
  }
}