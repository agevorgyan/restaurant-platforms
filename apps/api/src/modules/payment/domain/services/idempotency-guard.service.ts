import { IdempotencyRecord } from '../value-objects/idempotency-record.value-object';
import { IdempotencyPolicy } from '../policies/idempotency.policy';

export class IdempotencyGuard {
  private readonly policy = new IdempotencyPolicy();

  public protect<T>(
    idempotencyKey: string,
    existingRecord: IdempotencyRecord | null,
    operation: () => T
  ): { response: T; isCached: boolean; newRecord?: IdempotencyRecord } {
    const evaluation = this.policy.evaluate(existingRecord);

    if (evaluation.isIdempotent) {
      return { response: evaluation.response, isCached: true };
    }

    const newResponse = operation();
    const newRecord = IdempotencyRecord.create(idempotencyKey, newResponse);

    return { response: newResponse, isCached: false, newRecord };
  }
}
