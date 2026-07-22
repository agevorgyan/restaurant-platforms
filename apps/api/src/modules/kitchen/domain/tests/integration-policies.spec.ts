import { KitchenInventoryIntegrationPolicy, ConsumptionPolicy, ReservationSynchronizationPolicy } from '../policies/integration.policy';
import { Production } from '../aggregates/production.aggregate';
import { KitchenTicket } from '../aggregates/kitchen-ticket.aggregate';
import { ProductionNumber } from '../value-objects/production-number.value-object';
import { RecipeReference } from '../value-objects/recipe-reference.value-object';
import { ProductionType } from '../enums/production-type.enum';
import { KitchenTicketNumber } from '../value-objects/kitchen-ticket-number.value-object';

import { IngredientReference } from '../../../inventory/domain/value-objects/ingredient-reference.value-object';
import { PlannedQuantity } from '../value-objects/planned-quantity.value-object';
import { Quantity } from '../../../inventory/domain/value-objects/quantity.value-object';
import { UnitPrecision } from '../../../inventory/domain/value-objects/unit-precision.value-object';
import { ProductionIngredient } from '../entities/production-ingredient.entity';
import { StationReference } from '../value-objects/station-reference.value-object';
import { OrderItemReference } from '../value-objects/order-item-reference.value-object';
import { KitchenTicketItem } from '../entities/kitchen-ticket-item.entity';
import { KitchenTicketStatus } from '../value-objects/kitchen-ticket-status.value-object';
import { KitchenTicketStatus as KitchenTicketStatusEnum } from '../enums/kitchen-ticket-status.enum';
import { PreparationTime } from '../value-objects/preparation-time.value-object';

describe('Kitchen Inventory Integration Policies', () => {
  describe('KitchenInventoryIntegrationPolicy', () => {
    it('should ensure unique requests', () => {
      expect(() => KitchenInventoryIntegrationPolicy.ensureUniqueRequest('corr-1', ['corr-2', 'corr-3'])).not.toThrow();
    });

    it('should throw on duplicate requests', () => {
      expect(() => KitchenInventoryIntegrationPolicy.ensureUniqueRequest('corr-1', ['corr-1', 'corr-2'])).toThrow();
    });
  });

  describe('ConsumptionPolicy', () => {
    it('should allow consumption only for COMPLETED production', () => {
      const prodNum = ProductionNumber.create('P-1');
      const recRef = RecipeReference.create('R-1', 'CODE', 'Recipe');
      const ir = IngredientReference.create('ext-1', 'CODE');
      const pq = PlannedQuantity.create(Quantity.create(10, UnitPrecision.create(2)));
      const pi = ProductionIngredient.create('pi-1', ir, pq);
      const prod = Production.create('prod-1', prodNum, recRef, ProductionType.MANUFACTURING, [pi]);

      jest.spyOn(prod, 'status', 'get').mockReturnValue({ value: 'COMPLETED' } as any);
      
      expect(() => ConsumptionPolicy.validateConsumption(prod)).not.toThrow();

      jest.spyOn(prod, 'status', 'get').mockReturnValue({ value: 'IN_PROGRESS' } as any);
      expect(() => ConsumptionPolicy.validateConsumption(prod)).toThrow();
    });
  });

  describe('ReservationSynchronizationPolicy', () => {
    it('should allow release only for CANCELLED tickets', () => {
      const ticketNum = KitchenTicketNumber.create('T-1');
      const rr = RecipeReference.create('r-1', 'CODE', 'Name');
      const sr = StationReference.create('s-1', 'Grill');
      const oir = OrderItemReference.create('o-1', 'oi-1');
      const qty = Quantity.create(1, UnitPrecision.create(0));
      const status = KitchenTicketStatus.create(KitchenTicketStatusEnum.PENDING);
      const duration = PreparationTime.create(5);
      const item = KitchenTicketItem.create('kti-1', oir, rr, qty, status, duration, sr);
      const ticket = KitchenTicket.create('t-1', 'o-1', ticketNum, [item]);

      jest.spyOn(ticket, 'status', 'get').mockReturnValue({ isCancelled: () => true } as any);
      expect(() => ReservationSynchronizationPolicy.validateRelease(ticket)).not.toThrow();

      jest.spyOn(ticket, 'status', 'get').mockReturnValue({ isCancelled: () => false } as any);
      expect(() => ReservationSynchronizationPolicy.validateRelease(ticket)).toThrow();
    });
  });
});
