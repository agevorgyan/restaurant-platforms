import { KitchenTicket } from '../aggregates/kitchen-ticket.aggregate';
import { KitchenTicketNumber } from '../value-objects/kitchen-ticket-number.value-object';
import { KitchenTicketItem } from '../entities/kitchen-ticket-item.entity';
import { OrderItemReference } from '../value-objects/order-item-reference.value-object';
import { RecipeReference } from '../value-objects/recipe-reference.value-object';
import { KitchenTicketStatus } from '../value-objects/kitchen-ticket-status.value-object';
import { KitchenTicketStatus as KitchenTicketStatusEnum } from '../enums/kitchen-ticket-status.enum';
import { PreparationTime } from '../value-objects/preparation-time.value-object';
import { Quantity } from '../../../inventory/domain/value-objects/quantity.value-object';
import { UnitPrecision } from '../../../inventory/domain/value-objects/unit-precision.value-object';
import { ProductionPriority } from '../enums/production-priority.enum';
import { KitchenTicketDomainError } from '../errors/kitchen-ticket.domain-error';

describe('Kitchen Ticket Aggregate', () => {
  const createTestItem = (orderItemId: string) => {
    const oir = OrderItemReference.create('o-1', orderItemId);
    const rr = RecipeReference.create('r-1', 'CODE', 'Name');
    const qty = Quantity.create(1, UnitPrecision.create(0));
    const status = KitchenTicketStatus.create(KitchenTicketStatusEnum.PENDING);
    const pt = PreparationTime.create(15);
    return KitchenTicketItem.create('item-1', oir, rr, qty, status, pt);
  };

  const createTestTicket = () => {
    const num = KitchenTicketNumber.create('T-100');
    return KitchenTicket.create('kt-1', 'o-1', num, [createTestItem('oi-1')]);
  };

  it('should create valid kitchen ticket', () => {
    const ticket = createTestTicket();
    expect(ticket.status.isPending()).toBe(true);
    expect(ticket.items).toHaveLength(1);
    expect(ticket.timeline).toHaveLength(1);
    expect(ticket.timeline[0].status).toBe(KitchenTicketStatusEnum.PENDING);
    expect(ticket.domainEvents[0].constructor.name).toBe('KitchenTicketCreatedEvent');
  });

  it('should transition through valid lifecycle', () => {
    const ticket = createTestTicket();
    
    ticket.queue('SYSTEM');
    expect(ticket.status.isQueued()).toBe(true);
    
    ticket.startPreparation('CHEF-1');
    expect(ticket.status.isInPreparation()).toBe(true);
    
    ticket.markReady('CHEF-1');
    expect(ticket.status.isReady()).toBe(true);
    
    ticket.serve('WAITER-1');
    expect(ticket.status.isServed()).toBe(true);
  });

  it('should prevent invalid transitions', () => {
    const ticket = createTestTicket(); // PENDING
    
    expect(() => ticket.startPreparation('CHEF-1'))
      .toThrow(KitchenTicketDomainError); // Must be QUEUED
      
    expect(() => ticket.markReady('CHEF-1'))
      .toThrow(KitchenTicketDomainError); // Must be IN_PREPARATION
  });

  it('should allow cancellation before terminal state', () => {
    const ticket = createTestTicket();
    ticket.queue('SYSTEM');
    
    ticket.cancel('MANAGER', 'Customer left');
    expect(ticket.status.isCancelled()).toBe(true);
  });

  it('should prevent cancellation if already served', () => {
    const ticket = createTestTicket();
    ticket.queue('SYSTEM');
    ticket.startPreparation('CHEF-1');
    ticket.markReady('CHEF-1');
    ticket.serve('WAITER-1');
    
    expect(() => ticket.cancel('MANAGER', 'Customer left'))
      .toThrow(KitchenTicketDomainError);
  });

  it('should allow priority change and record override', () => {
    const ticket = createTestTicket(); // Defaults to NORMAL
    
    ticket.changePriority(ProductionPriority.RUSH, 'MANAGER', 'VIP');
    
    expect(ticket.priority.isRush()).toBe(true);
    
    // Check internal state using any just for testing internal overrides field since we don't have a public getter
    const overrides = (ticket as any).props.priorityOverrides;
    expect(overrides).toHaveLength(1);
    expect(overrides[0].newPriority).toBe(ProductionPriority.RUSH);
  });

  it('should prevent empty items creation', () => {
    const num = KitchenTicketNumber.create('T-100');
    expect(() => KitchenTicket.create('kt-1', 'o-1', num, []))
      .toThrow();
  });
});
