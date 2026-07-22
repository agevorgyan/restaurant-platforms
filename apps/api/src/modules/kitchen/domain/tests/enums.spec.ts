import { KitchenStation } from '../enums/kitchen-station.enum';
import { KitchenStatus } from '../enums/kitchen-status.enum';
import { ProductionPriority } from '../enums/production-priority.enum';
import { KitchenTicketStatus } from '../enums/kitchen-ticket-status.enum';

describe('Kitchen Enums', () => {
  it('should have valid KitchenStation values', () => {
    expect(KitchenStation.GRILL).toBe('GRILL');
  });

  it('should have valid KitchenStatus values', () => {
    expect(KitchenStatus.OPEN).toBe('OPEN');
  });

  it('should have valid ProductionPriority values', () => {
    expect(ProductionPriority.RUSH).toBe('RUSH');
  });

  it('should have valid KitchenTicketStatus values', () => {
    expect(KitchenTicketStatus.IN_PREPARATION).toBe('IN_PREPARATION');
  });
});
