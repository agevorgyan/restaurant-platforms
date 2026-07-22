import { KitchenEventVersion } from '../../value-objects/acl/kitchen-event-version.value-object';

export interface EventRegistration {
  eventName: string;
  supportedVersions: KitchenEventVersion[];
  requiredFields: string[];
}

export class KitchenEventRegistry {
  private static readonly INBOUND_EVENTS: Map<string, EventRegistration> = new Map([
    // Order
    ['KitchenTicketRequested', { eventName: 'KitchenTicketRequested', supportedVersions: [KitchenEventVersion.create(1, 0)], requiredFields: ['orderId', 'items'] }],
    ['OrderCancelled', { eventName: 'OrderCancelled', supportedVersions: [KitchenEventVersion.create(1, 0)], requiredFields: ['orderId', 'reason'] }],
    // Inventory
    ['IngredientsReserved', { eventName: 'IngredientsReserved', supportedVersions: [KitchenEventVersion.create(1, 0)], requiredFields: ['correlationId'] }],
    ['ReservationFailed', { eventName: 'ReservationFailed', supportedVersions: [KitchenEventVersion.create(1, 0)], requiredFields: ['correlationId', 'reason'] }],
    ['IngredientsAllocated', { eventName: 'IngredientsAllocated', supportedVersions: [KitchenEventVersion.create(1, 0)], requiredFields: ['correlationId'] }],
    ['IngredientsConsumed', { eventName: 'IngredientsConsumed', supportedVersions: [KitchenEventVersion.create(1, 0)], requiredFields: ['correlationId'] }],
    ['InventoryOutOfStock', { eventName: 'InventoryOutOfStock', supportedVersions: [KitchenEventVersion.create(1, 0)], requiredFields: ['ingredientId'] }],
    // Payment
    ['PaymentCompleted', { eventName: 'PaymentCompleted', supportedVersions: [KitchenEventVersion.create(1, 0)], requiredFields: ['orderId'] }],
    ['RefundCompleted', { eventName: 'RefundCompleted', supportedVersions: [KitchenEventVersion.create(1, 0)], requiredFields: ['orderId'] }],
    // Reservation
    ['ReservationConfirmed', { eventName: 'ReservationConfirmed', supportedVersions: [KitchenEventVersion.create(1, 0)], requiredFields: ['reservationId'] }],
    ['ReservationCancelled', { eventName: 'ReservationCancelled', supportedVersions: [KitchenEventVersion.create(1, 0)], requiredFields: ['reservationId'] }]
  ]);

  public static getInboundEventNames(): Set<string> {
    return new Set(this.INBOUND_EVENTS.keys());
  }

  public static getRegistration(eventName: string): EventRegistration | undefined {
    return this.INBOUND_EVENTS.get(eventName);
  }
}
