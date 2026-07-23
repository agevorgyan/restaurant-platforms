import { MenuAvailabilityEngine } from '../services/availability/menu-availability.engine';
import { DecisionStatus } from '../value-objects/availability-decision.value-object';

describe('MenuAvailabilityEngine', () => {
  it('should evaluate context and return AVAILABLE when no overrides are present', () => {
    const engine = new MenuAvailabilityEngine();
    const { result, event } = engine.execute({
      currentDateTime: new Date(),
      salesChannel: 'WEB',
      branchReference: 'BRANCH-1'
    });

    expect(result.decision.status).toBe(DecisionStatus.AVAILABLE);
    expect(result.reason.value).toBe('Standard availability');
    expect(event.decision).toBe(DecisionStatus.AVAILABLE);
  });

  it('should throw if context creation fails (missing branch)', () => {
    const engine = new MenuAvailabilityEngine();
    expect(() => {
      engine.execute({
        currentDateTime: new Date(),
        salesChannel: 'WEB',
        branchReference: ''
      });
    }).toThrow(/Branch reference is required/);
  });
});