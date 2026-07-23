import { ValueObject } from '@saas/core';

export interface ReservationContractMetadataProps { sourceContext: string; timestamp: Date; }
export class ReservationContractMetadata extends ValueObject<ReservationContractMetadataProps> {
  get sourceContext(): string { return this.props.sourceContext; }
  get timestamp(): Date { return this.props.timestamp; }
  private constructor(props: ReservationContractMetadataProps) { super(props); }
  public static create(sourceContext: string, timestamp: Date): ReservationContractMetadata { return new ReservationContractMetadata({ sourceContext, timestamp }); }
}