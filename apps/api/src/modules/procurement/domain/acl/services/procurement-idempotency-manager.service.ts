import { IdempotencySpecification } from '../specifications/acl.specifications';

export class ProcurementIdempotencyManager {
  private processedMessages: Set<string> = new Set();

  public checkDuplicate(messageId: string): boolean {
    const isDuplicate = !IdempotencySpecification.isSatisfiedBy(Array.from(this.processedMessages), messageId);
    if (!isDuplicate) {
      this.processedMessages.add(messageId);
    }
    return isDuplicate;
  }
}