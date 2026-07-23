import { ValueObject } from '@saas/core';

export interface KitchenStationReferenceProps { stationId: string; }

export class KitchenStationReference extends ValueObject<KitchenStationReferenceProps> {
  get stationId(): string { return this.props.stationId; }
  private constructor(props: KitchenStationReferenceProps) { super(props); }
  public static create(stationId: string): KitchenStationReference {
    if (!stationId) throw new Error('KitchenStationReference cannot be empty');
    return new KitchenStationReference({ stationId });
  }
}