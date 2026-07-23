import { IntegrationContext } from '../value-objects/integration-context.value-object';
import { ACLPolicy } from '../policies/core-acl.policies';

export class CustomerIntegrationGuard {
  public protect(context: IntegrationContext): void {
    ACLPolicy.enforce(context);
    // Prevents injection of foreign aggregates
    if (context.payload && context.payload._aggregateRoot) {
      throw new Error('Foreign aggregates cannot enter Customer Domain directly');
    }
  }
}