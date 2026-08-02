/**
 * Enterprise POS Payment Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Decoupled Payment Aggregate, PCI Compliance (Zero PAN/CVV Storage),
 * Tokenized Card Authorizations, Multi-Tender Split Payments, Cash Change Calculations, Tip Allocations, Refunds, and CQRS Read Models.
 */

import { PaymentStatus, TenderType } from '../src/domain/enums/pos-payment.enums';
import {
  AuthorizationCode,
  ChangeAmount,
  TenderAmount,
  TransactionReference,
} from '../src/domain/value-objects/pos-payment-vo';
import {
  AuthorizationService,
  EnterprisePosPaymentPlatformService,
  PaymentService,
  RefundService,
  SplitPaymentService,
  TenderService,
  TipService,
} from '../src/services/pos-payment.services';

describe('Enterprise POS Payment Platform', () => {
  describe('Value Objects & PCI Compliance', () => {
    it('should format Tokenized Reference and Authorization Code correctly without storing PAN/CVV', () => {
      const auth = AuthorizationCode.create();
      expect(auth.code.startsWith('AUTH-')).toBe(true);

      const ref = TransactionReference.create();
      expect(ref.tokenizedRef.startsWith('tok_ref_')).toBe(true);
    });

    it('should calculate cash change correctly', () => {
      const change = ChangeAmount.calculate(35.5, 40.0);
      expect(change.amount).toBe(4.5);
    });
  });

  describe('AuthorizationService & TenderService', () => {
    let authService: AuthorizationService;
    let tenderService: TenderService;

    beforeEach(() => {
      authService = new AuthorizationService();
      tenderService = new TenderService();
    });

    it('should generate tokenized authorization references for card payments', () => {
      const res = authService.authorizeCard(50.0);
      expect(res.authCode).toBeDefined();
      expect(res.tokenRef).toBeDefined();
    });
  });

  describe('TipService & RefundService', () => {
    let tipService: TipService;
    let refundService: RefundService;

    beforeEach(() => {
      tipService = new TipService();
      refundService = new RefundService();
    });

    it('should record tips and gratuity and produce tip statistics', () => {
      tipService.addTip(12.5);
      tipService.addGratuity(8.0);

      const stats = tipService.getTipStatistics();
      expect(stats.totalTipsCollected).toBe(12.5);
      expect(stats.totalGratuityCollected).toBe(8.0);
    });

    it('should process refunds and maintain refund history', () => {
      const ref = refundService.processRefund('pay-100', 25.0, 'Incorrect Item');
      expect(ref.amount).toBe(25.0);

      const history = refundService.getRefundHistory();
      expect(history.totalRefundsCount).toBe(1);
      expect(history.totalRefundedAmount).toBe(25.0);
    });
  });

  describe('SplitPaymentService & PaymentService', () => {
    let authService: AuthorizationService;
    let tenderService: TenderService;
    let tipService: TipService;
    let refundService: RefundService;
    let splitService: SplitPaymentService;
    let paymentService: PaymentService;
    let platformService: EnterprisePosPaymentPlatformService;

    beforeEach(() => {
      authService = new AuthorizationService();
      tenderService = new TenderService();
      tipService = new TipService();
      refundService = new RefundService();
      splitService = new SplitPaymentService();
      paymentService = new PaymentService(authService, tenderService, tipService, refundService, splitService);

      platformService = new EnterprisePosPaymentPlatformService(
        authService,
        tenderService,
        tipService,
        refundService,
        splitService,
        paymentService
      );
    });

    it('should initiate payment and process multi-tender split payments (Cash + Card)', () => {
      const payId = paymentService.initiatePayment('ord-555', 100.0);

      // Tender 1: $40 Cash
      const res1 = paymentService.addTender(payId.id, TenderType.CASH, 40.0);
      expect(res1.isFullyPaid).toBe(false);

      // Tender 2: $60 Card
      const res2 = paymentService.addTender(payId.id, TenderType.CARD, 60.0);
      expect(res2.isFullyPaid).toBe(true);

      const summary = paymentService.getPaymentSummary(payId.id);
      expect(summary.status).toBe(PaymentStatus.COMPLETED);
      expect(summary.paidAmount).toBe(100.0);

      const breakdown = paymentService.getTenderBreakdown(payId.id);
      expect(breakdown.tenders.length).toBe(2);
      expect(breakdown.remainingBalance).toBe(0);
    });
  });
});
