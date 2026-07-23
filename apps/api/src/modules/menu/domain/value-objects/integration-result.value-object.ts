import { ValueObject } from '@saas/core';

export interface IntegrationResultProps {
  kitchenAvailability: boolean;
  inventoryAvailability: boolean;
  availabilityStatus: string;
  failureReason?: string;
  evaluationTimestamp: Date;
}

export class IntegrationResult extends ValueObject<IntegrationResultProps> {
  get kitchenAvailability(): boolean { return this.props.kitchenAvailability; }
  get inventoryAvailability(): boolean { return this.props.inventoryAvailability; }
  get availabilityStatus(): string { return this.props.availabilityStatus; }
  get failureReason(): string | undefined { return this.props.failureReason; }
  get evaluationTimestamp(): Date { return this.props.evaluationTimestamp; }

  private constructor(props: IntegrationResultProps) { super(props); }
  public static create(props: IntegrationResultProps): IntegrationResult {
    return new IntegrationResult(props);
  }
}