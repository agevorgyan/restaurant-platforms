import { FailureHandlingPolicy, RetryPolicy } from '../../policies/integration.policy';

export class InventoryFailureHandler {
  public handleFailure(reason: string, failureCount: number): void {
    FailureHandlingPolicy.handleFailure(reason);
    if (RetryPolicy.shouldRetry(failureCount)) {
      // Schedule retry via outbox
    } else {
      // Terminal failure, perhaps trigger compensatory transaction
    }
  }
}