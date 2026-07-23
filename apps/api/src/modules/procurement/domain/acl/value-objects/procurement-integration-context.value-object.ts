import { ValueObject } from '@saas/core';

export interface ProcurementIntegrationContextProps {
  correlationId: string;
  causationId: string;
  producerId: string;
  timestamp: Date;
}

export class ProcurementIntegrationContext extends ValueObject<ProcurementIntegrationContextProps> {
  get correlationId(): string { return this.props.correlationId; }
  get causationId(): string { return this.props.causationId; }
  get producerId(): string { return this.props.producerId; }
  get timestamp(): Date { return this.props.timestamp; }

  private constructor(props: ProcurementIntegrationContextProps) { super(props); }
  public static create(props: ProcurementIntegrationContextProps): ProcurementIntegrationContext {
    return new ProcurementIntegrationContext({ ...props, timestamp: props.timestamp || new Date() });
  }
}