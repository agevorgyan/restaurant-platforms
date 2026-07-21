import { PricingSession } from '../aggregates/pricing-session.aggregate';
import { PricingSessionId } from '../value-objects/pricing-session-id.value-object';

export interface PricingSessionRepository {
  findById(id: PricingSessionId): Promise<PricingSession | null>;
  save(session: PricingSession): Promise<void>;
}
