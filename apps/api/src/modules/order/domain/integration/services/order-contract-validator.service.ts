import { OrderIntegrationPolicy } from '../policies/order-integration.policy';
import { IntegrationEvent } from './order-event-factory.service';

export type ValidationResult = { isSuccess: true } | { isFailure: true; error: string };

export class OrderContractValidator {
  private readonly schemas = new Map<string, string[]>();

  constructor(private readonly policy: OrderIntegrationPolicy) {}

  public registerSchema(eventName: string, requiredFields: string[]): void {
    if (this.schemas.has(eventName)) {
      throw new Error(`Schema for ${eventName} already registered`);
    }
    this.schemas.set(eventName, requiredFields);
  }

  public validate(event: IntegrationEvent): ValidationResult {
    const requiredFields = this.schemas.get(event.eventName);
    
    if (!requiredFields) {
      return { isFailure: true, error: `No schema registered for ${event.eventName}` };
    }

    return this.policy.validate(event.context, event.payload, requiredFields);
  }
}
