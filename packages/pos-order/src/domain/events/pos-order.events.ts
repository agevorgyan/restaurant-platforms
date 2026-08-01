/**
 * Enterprise POS Order Entry Platform - Domain Events
 *
 * Domain events emitted during order drafting, line item manipulation, modifier application, price calculation, course/seat assignment, and order validation.
 */

import { OrderStatus } from '../enums/pos-order.enums';

export interface OrderCreatedEvent {
  eventName: 'OrderCreated';
  orderId: string;
  orderNumber: string;
  orderType: string;
  timestamp: Date;
}

export interface LineAddedEvent {
  eventName: 'LineAdded';
  orderId: string;
  lineId: string;
  productId: string;
  quantity: number;
  timestamp: Date;
}

export interface LineRemovedEvent {
  eventName: 'LineRemoved';
  orderId: string;
  lineId: string;
  timestamp: Date;
}

export interface ModifierAppliedEvent {
  eventName: 'ModifierApplied';
  orderId: string;
  lineId: string;
  modifierId: string;
  priceDelta: number;
  timestamp: Date;
}

export interface PriceCalculatedEvent {
  eventName: 'PriceCalculated';
  orderId: string;
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  grandTotal: number;
  timestamp: Date;
}

export interface CourseAssignedEvent {
  eventName: 'CourseAssigned';
  orderId: string;
  lineId: string;
  courseNumber: number;
  timestamp: Date;
}

export interface SeatAssignedEvent {
  eventName: 'SeatAssigned';
  orderId: string;
  lineId: string;
  seatNumber: number;
  timestamp: Date;
}

export interface OrderValidatedEvent {
  eventName: 'OrderValidated';
  orderId: string;
  status: OrderStatus;
  timestamp: Date;
}

export type PosOrderDomainEvent =
  | OrderCreatedEvent
  | LineAddedEvent
  | LineRemovedEvent
  | ModifierAppliedEvent
  | PriceCalculatedEvent
  | CourseAssignedEvent
  | SeatAssignedEvent
  | OrderValidatedEvent;
