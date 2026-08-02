/**
 * Enterprise Reservation Management Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Independent Reservation Aggregate, Deterministic Availability Matrix,
 * Booking Rule Validation, Deposit Workflows (PendingDeposit -> Confirmed), Policy Expiration, and CQRS Read Models.
 */

import { ReservationSource, ReservationStatus } from '../src/domain/enums/reservation-management.enums';
import {
  DepositAmount,
  GuestPreferences,
  PartySize,
  ReservationChannel,
} from '../src/domain/value-objects/reservation-management-vo';
import {
  AvailabilityService,
  BookingRuleService,
  DepositService,
  EnterpriseReservationPlatformService,
  PolicyService,
  ReservationChannelService,
  ReservationService,
} from '../src/services/reservation-management.services';

describe('Enterprise Reservation Management Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format PartySize and DepositAmount correctly', () => {
      const party = PartySize.create(4);
      expect(party.count).toBe(4);

      expect(() => PartySize.create(0)).toThrow('Party size must be greater than zero');

      const deposit = DepositAmount.create(100.0, true);
      expect(deposit.amount).toBe(100.0);
      expect(deposit.isRequired).toBe(true);
    });

    it('should format ReservationChannel and GuestPreferences correctly', () => {
      const channel = ReservationChannel.create(ReservationSource.GOOGLE, 'ReserveWithGoogle');
      expect(channel.source).toBe(ReservationSource.GOOGLE);
      expect(channel.partnerName).toBe('ReserveWithGoogle');

      const prefs = GuestPreferences.create(true, ['GLUTEN_FREE']);
      expect(prefs.isVip).toBe(true);
      expect(prefs.dietaryRestrictions.includes('GLUTEN_FREE')).toBe(true);
    });
  });

  describe('AvailabilityService & BookingRuleService', () => {
    let availabilityService: AvailabilityService;
    let bookingRuleService: BookingRuleService;

    beforeEach(() => {
      availabilityService = new AvailabilityService();
      bookingRuleService = new BookingRuleService();
    });

    it('should check availability and return availability matrix', () => {
      const isAvailable = availabilityService.checkAvailability(new Date(), 4, 20);
      expect(isAvailable).toBe(true);

      const matrix = availabilityService.getAvailabilityMatrix('2026-08-15');
      expect(matrix.slots.length).toBe(3);
    });

    it('should enforce party size min/max bounds', () => {
      expect(bookingRuleService.validatePartySize(4, 1, 10)).toBe(true);

      expect(() => {
        bookingRuleService.validatePartySize(15, 1, 10);
      }).toThrow('Booking error');
    });
  });

  describe('DepositService & PolicyService', () => {
    let depositService: DepositService;
    let policyService: PolicyService;

    beforeEach(() => {
      depositService = new DepositService();
      policyService = new PolicyService();
    });

    it('should calculate required deposits for large parties', () => {
      const depSmall = depositService.calculateRequiredDeposit(4, 6, 25.0);
      expect(depSmall.isRequired).toBe(false);

      const depLarge = depositService.calculateRequiredDeposit(8, 6, 25.0);
      expect(depLarge.isRequired).toBe(true);
      expect(depLarge.amount).toBe(200.0);
    });
  });

  describe('ReservationService & Read Models', () => {
    let availabilityService: AvailabilityService;
    let bookingRuleService: BookingRuleService;
    let depositService: DepositService;
    let policyService: PolicyService;
    let channelService: ReservationChannelService;
    let reservationService: ReservationService;
    let platformService: EnterpriseReservationPlatformService;

    beforeEach(() => {
      availabilityService = new AvailabilityService();
      bookingRuleService = new BookingRuleService();
      depositService = new DepositService();
      policyService = new PolicyService();
      channelService = new ReservationChannelService();
      reservationService = new ReservationService(
        availabilityService,
        bookingRuleService,
        depositService,
        policyService
      );

      platformService = new EnterpriseReservationPlatformService(
        availabilityService,
        bookingRuleService,
        depositService,
        policyService,
        channelService,
        reservationService
      );
    });

    it('should create reservation requiring deposit and confirm upon deposit payment', () => {
      const resId = reservationService.createReservation('Alice Smith', 8, new Date(), ReservationSource.WEBSITE, true);
      expect(resId.id).toBeDefined();

      reservationService.confirmDeposit(resId.id, 'tok_dep_12345');

      const calendar = reservationService.getReservationCalendar('2026-08-15');
      expect(calendar.totalReservationsCount).toBe(1);
      expect(calendar.reservations[0].status).toBe(ReservationStatus.CONFIRMED);

      const stats = reservationService.getReservationStatistics();
      expect(stats.confirmedPercentage).toBe(100);
    });
  });
});
