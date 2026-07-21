import { IdempotencyRecord } from '../value-objects/idempotency-record.value-object';
import { IdempotencySpecification } from '../specifications/idempotency.specification';

export class IdempotencyPolicy {
  private readonly idempotencySpec = new IdempotencySpecification();

  public evaluate(existingRecord: IdempotencyRecord | null): { isIdempotent: boolean; response?: any } {
    if (this.idempotencySpec.isSatisfiedBy(existingRecord)) {
      // Record exists, return the cached response
      return { isIdempotent: true, response: existingRecord!.response };
    }

    // No existing record, operation must proceed normally
    return { isIdempotent: false };
  }
}
