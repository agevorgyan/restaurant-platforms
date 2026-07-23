import { ValueObject } from '@saas/core';

export interface ReceivingLocationProps { locationId: string; description?: string; }

export class ReceivingLocation extends ValueObject<ReceivingLocationProps> {
  get locationId(): string { return this.props.locationId; }
  get description(): string | undefined { return this.props.description; }
  private constructor(props: ReceivingLocationProps) { super(props); }
  public static create(locationId: string, description?: string): ReceivingLocation {
    if (!locationId) throw new Error('ReceivingLocation location ID cannot be empty');
    return new ReceivingLocation({ locationId, description });
  }
}