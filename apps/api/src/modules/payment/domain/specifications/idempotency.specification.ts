import { IdempotencyRecord } from '../value-objects/idempotency-record.value-object';

export class IdempotencySpecification {
  public isSatisfiedBy(existingRecord: IdempotencyRecord | null): boolean {
    // If a record already exists for the idempotency key, the operation is considered duplicate (idempotent).
    // The specification checks if we have hit an idempotency guard.
    return existingRecord !== null;
  }
}
