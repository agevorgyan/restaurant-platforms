/**
 * Enterprise POS Order Entry Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Order Summary, Current Ticket, Seat Overview,
 * Course Overview, Price Breakdown, and Draft Orders.
 */

import { LineStatus, OrderStatus } from '../domain/enums/pos-order.enums';

export interface OrderSummaryReadModel {
  orderId: string;
  orderNumber: string;
  orderType: string;
  tableNo?: string;
  guestCount: number;
  status: OrderStatus;
  grandTotal: number;
  createdAt: string;
}

export interface TicketLineItemReadModel {
  lineId: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  modifiers: Array<{ name: string; priceDelta: number }>;
  seatNumber: number;
  courseNumber: number;
  lineStatus: LineStatus;
  lineTotal: number;
}

export interface CurrentTicketReadModel {
  orderId: string;
  orderNumber: string;
  orderType: string;
  status: OrderStatus;
  lines: TicketLineItemReadModel[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  grandTotal: number;
}

export interface SeatOverviewReadModel {
  orderId: string;
  seatNumber: number;
  assignedItemsCount: number;
  seatSubtotal: number;
}

export interface CourseOverviewReadModel {
  orderId: string;
  courseNumber: number;
  courseName: string;
  itemsCount: number;
}

export interface PriceBreakdownReadModel {
  subtotal: number;
  modifierTotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
}

export interface DraftOrdersReadModel {
  totalDraftsCount: number;
  drafts: OrderSummaryReadModel[];
}
