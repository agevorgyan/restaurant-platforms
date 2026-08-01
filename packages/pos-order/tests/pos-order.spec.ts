/**
 * Enterprise POS Order Entry Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, OrderAggregate Transaction Boundary, Deterministic Pricing Engine,
 * Modifier Selection Rules, Course Assignment (Starter, Main, Dessert), Seat Assignment, Supervisor Price Override Validation, and CQRS Read Models.
 */

import { LineStatus, OrderStatus } from '../src/domain/enums/pos-order.enums';
import {
  CourseNumber,
  ModifierSelection,
  Money,
  Quantity,
  SeatNumber,
} from '../src/domain/value-objects/pos-order-vo';
import {
  CourseService,
  EnterprisePosOrderPlatformService,
  ModifierService,
  OrderService,
  PricingService,
  SeatService,
  ValidationService,
} from '../src/services/pos-order.services';

describe('Enterprise POS Order Entry Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format Quantity and Money correctly', () => {
      const qty = Quantity.create(3);
      expect(qty.value).toBe(3);

      expect(() => Quantity.create(0)).toThrow('Quantity must be greater than zero');

      const m1 = Money.create(15.5);
      const m2 = Money.create(4.5);
      expect(m1.add(m2).amount).toBe(20.0);
    });

    it('should format ModifierSelection correctly', () => {
      const mod = ModifierSelection.create('mod-cheese', 'Extra Cheese', 2.5);
      expect(mod.modifierId).toBe('mod-cheese');
      expect(mod.priceDelta.amount).toBe(2.5);
    });
  });

  describe('PricingService & Deterministic Pricing', () => {
    let pricingService: PricingService;

    beforeEach(() => {
      pricingService = new PricingService();
    });

    it('should calculate deterministic price breakdown including subtotal, modifiers, and tax', () => {
      const lines = [
        {
          lineId: 'l1',
          productId: 'p-pizza',
          productName: 'Margherita Pizza',
          unitPrice: 18.0,
          quantity: 2,
          modifiers: [{ name: 'Extra Cheese', priceDelta: 2.5 }],
          seatNumber: 1,
          courseNumber: 2,
          lineStatus: LineStatus.NORMAL,
          lineTotal: 41.0,
        },
      ];

      const pb = pricingService.calculateBreakdown(lines, 0.1);
      expect(pb.subtotal.amount).toBe(36.0);
      expect(pb.modifierTotal.amount).toBe(5.0);
      expect(pb.taxTotal.amount).toBe(4.1);
      expect(pb.grandTotal.amount).toBe(45.1);
    });
  });

  describe('ModifierService, CourseService & SeatService', () => {
    let modifierService: ModifierService;
    let courseService: CourseService;
    let seatService: SeatService;

    beforeEach(() => {
      modifierService = new ModifierService();
      courseService = new CourseService();
      seatService = new SeatService();
    });

    it('should apply modifier selections and update line totals', () => {
      const line = {
        lineId: 'l1',
        productId: 'p-burger',
        productName: 'Cheeseburger',
        unitPrice: 12.0,
        quantity: 1,
        modifiers: [],
        seatNumber: 1,
        courseNumber: 2,
        lineStatus: LineStatus.NORMAL,
        lineTotal: 12.0,
      };

      const updated = modifierService.applyModifier(line, ModifierSelection.create('mod-bacon', 'Bacon Add-on', 3.0));
      expect(updated.modifiers.length).toBe(1);
      expect(updated.lineTotal).toBe(15.0);
      expect(updated.lineStatus).toBe(LineStatus.MODIFIED);
    });

    it('should assign course numbers and seat numbers correctly', () => {
      const line = {
        lineId: 'l1',
        productId: 'p-soup',
        productName: 'Soup of the Day',
        unitPrice: 8.0,
        quantity: 1,
        modifiers: [],
        seatNumber: 1,
        courseNumber: 1,
        lineStatus: LineStatus.NORMAL,
        lineTotal: 8.0,
      };

      const courseAssigned = courseService.assignCourse(line, CourseNumber.create(1, 'Starter'));
      expect(courseAssigned.courseNumber).toBe(1);

      const seatAssigned = seatService.assignSeat(line, SeatNumber.create(3));
      expect(seatAssigned.seatNumber).toBe(3);
    });
  });

  describe('ValidationService & Supervisor Price Override', () => {
    let validationService: ValidationService;

    beforeEach(() => {
      validationService = new ValidationService();
    });

    it('should require supervisor approval for price overrides', () => {
      expect(validationService.validatePriceOverride(20.0, 20.0, false)).toBe(true);

      expect(() => {
        validationService.validatePriceOverride(20.0, 15.0, false);
      }).toThrow('Price override error: Supervisor authorization required');

      expect(validationService.validatePriceOverride(20.0, 15.0, true)).toBe(true);
    });
  });

  describe('EnterprisePosOrderPlatformService & Read Models', () => {
    let pricingService: PricingService;
    let modifierService: ModifierService;
    let courseService: CourseService;
    let seatService: SeatService;
    let validationService: ValidationService;
    let orderService: OrderService;
    let platformService: EnterprisePosOrderPlatformService;

    beforeEach(() => {
      pricingService = new PricingService();
      modifierService = new ModifierService();
      courseService = new CourseService();
      seatService = new SeatService();
      validationService = new ValidationService();
      orderService = new OrderService(pricingService, modifierService, courseService, seatService);

      platformService = new EnterprisePosOrderPlatformService(
        pricingService,
        modifierService,
        courseService,
        seatService,
        validationService,
        orderService
      );
    });

    it('should create order draft, add line items, and query CurrentTicket read model', () => {
      const orderId = orderService.createOrderDraft('Dine-In', 'T-12', 4);
      expect(orderId.id).toBeDefined();

      orderService.addLineItem(orderId.id, 'p-pasta', 'Truffle Pasta', 24.0, 2);

      const ticket = orderService.getCurrentTicket(orderId.id);
      expect(ticket.lines.length).toBe(1);
      expect(ticket.subtotal).toBe(48.0);
      expect(ticket.grandTotal).toBe(52.8);

      const drafts = orderService.getDraftOrders();
      expect(drafts.totalDraftsCount).toBe(1);
    });
  });
});
