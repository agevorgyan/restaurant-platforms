import { KitchenInventoryMapper } from '../services/integration/kitchen-inventory-mapper';
import { KitchenInventoryEventFactory } from '../services/integration/kitchen-inventory-event-factory';
import { KitchenInventoryContractValidator } from '../services/integration/kitchen-inventory-contract-validator';
import { Production } from '../aggregates/production.aggregate';
import { KitchenTicket } from '../aggregates/kitchen-ticket.aggregate';
import { IngredientReference } from '../../../inventory/domain/value-objects/ingredient-reference.value-object';
import { PlannedQuantity } from '../value-objects/planned-quantity.value-object';
import { Quantity } from '../../../inventory/domain/value-objects/quantity.value-object';
import { UnitPrecision } from '../../../inventory/domain/value-objects/unit-precision.value-object';
import { ProductionIngredient } from '../entities/production-ingredient.entity';
import { ProductionNumber } from '../value-objects/production-number.value-object';
import { RecipeReference } from '../value-objects/recipe-reference.value-object';
import { ProductionType } from '../enums/production-type.enum';
import { KitchenTicketNumber } from '../value-objects/kitchen-ticket-number.value-object';
import { InventoryResponseReference } from '../value-objects/integration/inventory-response-reference.value-object';
import { StationReference } from '../value-objects/station-reference.value-object';
import { OrderItemReference } from '../value-objects/order-item-reference.value-object';
import { KitchenTicketItem } from '../entities/kitchen-ticket-item.entity';
import { KitchenTicketStatus } from '../value-objects/kitchen-ticket-status.value-object';
import { KitchenTicketStatus as KitchenTicketStatusEnum } from '../enums/kitchen-ticket-status.enum';
import { PreparationTime } from '../value-objects/preparation-time.value-object';

describe('Kitchen Inventory Integration Services', () => {
  const createProduction = () => {
    const ir = IngredientReference.create('ext-1', 'CODE');
    const pq = PlannedQuantity.create(Quantity.create(10, UnitPrecision.create(2)));
    const pi = ProductionIngredient.create('pi-1', ir, pq);
    const prodNum = ProductionNumber.create('P-1');
    const recRef = RecipeReference.create('R-1', 'CODE', 'Recipe');
    return Production.create('prod-1', prodNum, recRef, ProductionType.MANUFACTURING, [pi]);
  };

  const createTicket = () => {
    const ticketNum = KitchenTicketNumber.create('T-1');
    const rr = RecipeReference.create('r-1', 'CODE', 'Name');
    const sr = StationReference.create('s-1', 'Grill');
    const oir = OrderItemReference.create('o-1', 'oi-1');
    const qty = Quantity.create(1, UnitPrecision.create(0));
    const status = KitchenTicketStatus.create(KitchenTicketStatusEnum.PENDING);
    const duration = PreparationTime.create(5);
    const item = KitchenTicketItem.create('kti-1', oir, rr, qty, status, duration, sr);
    return KitchenTicket.create('t-1', 'o-1', ticketNum, [item]);
  };

  describe('KitchenInventoryMapper', () => {
    it('should map production to consumption request', () => {
      const prod = createProduction();
      const req = KitchenInventoryMapper.mapProductionToConsumptionRequest(prod, 'corr-1');

      expect(req.reference.correlationId).toBe('corr-1');
      expect(req.productionId).toBe(prod.id);
      expect(req.items[0].ingredientId).toBe('ext-1');
      expect(req.items[0].quantity.value).toBe(10);
    });

    it('should map production to reservation request', () => {
      const prod = createProduction();
      const req = KitchenInventoryMapper.mapProductionToReservationRequest(prod, 'corr-1');

      expect(req.reference.correlationId).toBe('corr-1');
      expect(req.productionId).toBe(prod.id);
      expect(req.items[0].ingredientId).toBe('ext-1');
      expect(req.items[0].quantity.value).toBe(10);
    });
  });

  describe('KitchenInventoryContractValidator', () => {
    it('should validate outbound consumption', () => {
      const prod = createProduction();
      const req = KitchenInventoryMapper.mapProductionToConsumptionRequest(prod, 'corr-1');
      expect(() => KitchenInventoryContractValidator.validateOutboundConsumption(req)).not.toThrow();
    });

    it('should validate inbound response', () => {
      const res = InventoryResponseReference.create('corr-1', true);
      expect(() => KitchenInventoryContractValidator.validateInboundResponse(res)).not.toThrow();
    });
  });

  describe('KitchenInventoryEventFactory', () => {
    it('should create consumption event if valid', () => {
      const prod = createProduction();
      jest.spyOn(prod, 'status', 'get').mockReturnValue({ value: 'COMPLETED' } as any);

      const event = KitchenInventoryEventFactory.createConsumptionEvent(prod, 'corr-1');
      expect(event.getAggregateId()).toBe('corr-1');
      expect(event.request.productionId).toBe(prod.id);
    });

    it('should throw creating consumption event if production not completed', () => {
      const prod = createProduction();
      // Status defaults to PLANNED
      expect(() => KitchenInventoryEventFactory.createConsumptionEvent(prod, 'corr-1')).toThrow();
    });

    it('should create release event if ticket cancelled', () => {
      const ticket = createTicket();
      jest.spyOn(ticket, 'status', 'get').mockReturnValue({ isCancelled: () => true } as any);

      const event = KitchenInventoryEventFactory.createReleaseEvent(ticket, 'corr-1', 'Customer requested');
      expect(event.getAggregateId()).toBe('corr-1');
      expect(event.reason).toBe('Customer requested');
    });
  });
});
