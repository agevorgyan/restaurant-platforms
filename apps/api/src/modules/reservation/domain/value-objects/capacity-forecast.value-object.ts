import { ValueObject } from '@saas/core';

export interface CapacityForecastProps { totalCapacity: number; reservedCapacity: number; availableCapacity: number; }
export class CapacityForecast extends ValueObject<CapacityForecastProps> {
  get totalCapacity(): number { return this.props.totalCapacity; }
  get reservedCapacity(): number { return this.props.reservedCapacity; }
  get availableCapacity(): number { return this.props.availableCapacity; }
  private constructor(props: CapacityForecastProps) { super(props); }
  public static create(totalCapacity: number, reservedCapacity: number, availableCapacity: number): CapacityForecast { return new CapacityForecast({ totalCapacity, reservedCapacity, availableCapacity }); }
}