import { CheckoutSession } from '../aggregates/checkout-session.aggregate';

export interface CheckoutSessionRepository {
  save(session: CheckoutSession): Promise<void>;
  findById(id: string): Promise<CheckoutSession | null>;
  findByToken(token: string): Promise<CheckoutSession | null>;
}
