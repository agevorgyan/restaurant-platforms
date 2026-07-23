import { ValueObject } from '@saas/core';

export interface DeliveryZoneReferenceProps { zoneId: string; }

export class DeliveryZoneReference extends ValueObject<DeliveryZoneReferenceProps> {
  get zoneId(): string { return this.props.zoneId; }
  private constructor(props: DeliveryZoneReferenceProps) { super(props); }
  public static create(zoneId: string): DeliveryZoneReference {
    return new DeliveryZoneReference({ zoneId });
  }
}