import { OrderItemReference } from '../value-objects/order-item-reference.value-object';
import { RecipeReference } from '../value-objects/recipe-reference.value-object';
import { KitchenTicketStatus } from '../value-objects/kitchen-ticket-status.value-object';
import { KitchenTicketStatus as KitchenTicketStatusEnum } from '../enums/kitchen-ticket-status.enum';
import { KitchenTicketItem } from '../entities/kitchen-ticket-item.entity';
import { Quantity } from '../../../inventory/domain/value-objects/quantity.value-object';
import { UnitPrecision } from '../../../inventory/domain/value-objects/unit-precision.value-object';
import { PreparationTime } from '../value-objects/preparation-time.value-object';
import { StationReference } from '../value-objects/station-reference.value-object';
import { KitchenStationAssignment } from '../entities/kitchen-station-assignment.entity';
import { KitchenTimeline } from '../entities/kitchen-timeline.entity';
import { KitchenNote } from '../entities/kitchen-note.entity';
import { KitchenPriorityOverride } from '../entities/kitchen-priority-override.entity';
import { ProductionPriority } from '../enums/production-priority.enum';

describe('Kitchen Ticket Entities', () => {
  describe('KitchenTicketItem', () => {
    it('should create valid ticket item', () => {
      const oir = OrderItemReference.create('o-1', 'oi-1');
      const rr = RecipeReference.create('r-1', 'CODE', 'Name');
      const qty = Quantity.create(1, UnitPrecision.create(0));
      const status = KitchenTicketStatus.create(KitchenTicketStatusEnum.PENDING);
      const pt = PreparationTime.create(15);
      
      const item = KitchenTicketItem.create('id', oir, rr, qty, status, pt);
      expect(item.quantity.value).toBe(1);
    });

    it('should assign to station', () => {
      const oir = OrderItemReference.create('o-1', 'oi-1');
      const rr = RecipeReference.create('r-1', 'CODE', 'Name');
      const qty = Quantity.create(1, UnitPrecision.create(0));
      const status = KitchenTicketStatus.create(KitchenTicketStatusEnum.PENDING);
      const pt = PreparationTime.create(15);
      
      const item = KitchenTicketItem.create('id', oir, rr, qty, status, pt);
      item.assignToStation(StationReference.create('st-1', 'Grill'));
      
      expect(item.stationReference?.name).toBe('Grill');
    });

    it('should throw on negative quantity', () => {
      const oir = OrderItemReference.create('o-1', 'oi-1');
      const rr = RecipeReference.create('r-1', 'CODE', 'Name');
      const qty = Quantity.create(0, UnitPrecision.create(0));
      const status = KitchenTicketStatus.create(KitchenTicketStatusEnum.PENDING);
      const pt = PreparationTime.create(15);
      
      expect(() => KitchenTicketItem.create('id', oir, rr, qty, status, pt)).toThrow('Quantity must be greater than zero');
    });
  });

  describe('KitchenStationAssignment', () => {
    it('should create and unassign', () => {
      const st = StationReference.create('st-1', 'Grill');
      const assignment = KitchenStationAssignment.create('id', st);
      
      expect(assignment.isCurrent).toBe(true);
      assignment.unassign();
      expect(assignment.isCurrent).toBe(false);
      expect(assignment.unassignedAt).toBeDefined();
    });
  });

  describe('KitchenTimeline', () => {
    it('should create timeline entry', () => {
      const tl = KitchenTimeline.create('id', KitchenTicketStatusEnum.PENDING, 'USER-1', 'Created');
      expect(tl.status).toBe(KitchenTicketStatusEnum.PENDING);
      expect(tl.triggeredBy).toBe('USER-1');
    });
  });

  describe('KitchenNote', () => {
    it('should create note', () => {
      const note = KitchenNote.create('id', 'Extra spicy', 'AUTHOR-1');
      expect(note.content).toBe('Extra spicy');
    });
  });

  describe('KitchenPriorityOverride', () => {
    it('should create override', () => {
      const override = KitchenPriorityOverride.create('id', ProductionPriority.NORMAL, ProductionPriority.RUSH, 'VIP', 'AUTHOR-1');
      expect(override.newPriority).toBe(ProductionPriority.RUSH);
    });

    it('should throw if priority is same', () => {
      expect(() => KitchenPriorityOverride.create('id', ProductionPriority.NORMAL, ProductionPriority.NORMAL, 'VIP', 'AUTHOR-1')).toThrow('New priority must be different from previous priority');
    });
  });
});
