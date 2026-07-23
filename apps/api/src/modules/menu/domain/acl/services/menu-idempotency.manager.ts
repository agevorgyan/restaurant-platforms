import { IdempotencySpecification } from '../specifications/menu-acl.specifications';

export class MenuIdempotencyManager {
  public isProcessed(eventId: string, checkFn: (id: string) => boolean): boolean {
    const alreadyProcessed = checkFn(eventId);
    return !IdempotencySpecification.isSatisfiedBy(eventId, alreadyProcessed);
  }
}