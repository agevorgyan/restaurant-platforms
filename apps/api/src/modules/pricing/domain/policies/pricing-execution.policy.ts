import { PricingSession } from '../aggregates/pricing-session.aggregate';

export class PricingExecutionPolicy {
  public canExecute(session: PricingSession): boolean {
    if (session.isClosed) {
      return false;
    }

    if (session.lineItems.length === 0) {
      return false; // Cannot price an empty session/cart
    }

    return true;
  }
}
