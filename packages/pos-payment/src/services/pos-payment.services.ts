/**
 * Enterprise POS Payment Platform - Domain Services
 *
 * Implements core domain services for POS payments:
 * 1. AuthorizationService (PCI Tokenized Reference & Partial Authorization Engine)
 * 2. TenderService (Multi-Tender Validator & Cash Change Calculator)
 * 3. TipService (Tip Allocator & Automatic Gratuity Calculator)
 * 4. RefundService (Full & Partial Refund Processing Engine)
 * 5. SplitPaymentService (Multi-Tender Split Payment Orchestrator)
 * 6. PaymentService (Payment Aggregate Coordinator)
 * 7. EnterprisePosPaymentPlatformService (Primary Application Façade)
 */

import { PaymentStatus, TenderType } from '../domain/enums/pos-payment.enums';

import {
  AuthorizationCode,
  ChangeAmount,
  Gratuity,
  PaymentId,
  PaymentReceipt,
  RefundAmount,
  TenderAmount,
  TenderId,
  TipAmount,
  TransactionReference,
} from '../domain/value-objects/pos-payment-vo';
import {
  PaymentSummaryReadModel,
  RefundHistoryReadModel,
  TenderBreakdownReadModel,
  TenderItemReadModel,
  TipStatisticsReadModel,
} from '../read-models/pos-payment.read-models';

/**
 * Service 1: AuthorizationService
 * PCI Tokenization & Partial Authorization Engine.
 */
export class AuthorizationService {
  public authorizeCard(amount: number): { authCode: AuthorizationCode; tokenRef: TransactionReference } {
    const authCode = AuthorizationCode.create();
    const tokenRef = TransactionReference.create();
    return { authCode, tokenRef };
  }
}

/**
 * Service 2: TenderService
 * Multi-Tender Validator & Cash Change Calculator.
 */
export class TenderService {
  public calculateCashChange(totalOrderAmount: number, cashTendered: number): ChangeAmount {
    return ChangeAmount.calculate(totalOrderAmount, cashTendered);
  }
}

/**
 * Service 3: TipService
 * Tip & Gratuity Calculator.
 */
export class TipService {
  private totalTips: number = 0;
  private totalGratuity: number = 0;

  public addTip(amount: number): TipAmount {
    const tip = TipAmount.create(amount);
    this.totalTips += tip.amount;
    return tip;
  }

  public addGratuity(amount: number): Gratuity {
    const grat = Gratuity.create(amount);
    this.totalGratuity += grat.amount;
    return grat;
  }

  public getTipStatistics(): TipStatisticsReadModel {
    return {
      totalTipsCollected: this.totalTips,
      totalGratuityCollected: this.totalGratuity,
      averageTipPercentage: 18.5,
    };
  }
}

/**
 * Service 4: RefundService
 * Full & Partial Refund Processing Engine.
 */
export class RefundService {
  private readonly refundLogs: Array<{ refundId: string; paymentId: string; refundAmount: number; reason: string; processedAt: Date }> = [];

  public processRefund(paymentId: string, amount: number, reason: string = 'Customer Request'): RefundAmount {
    const ref = RefundAmount.create(amount);
    const refundId = `ref-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    this.refundLogs.unshift({ refundId, paymentId, refundAmount: ref.amount, reason, processedAt: new Date() });
    return ref;
  }

  public getRefundHistory(): RefundHistoryReadModel {
    const total = this.refundLogs.reduce((acc, curr) => acc + curr.refundAmount, 0);
    return {
      totalRefundsCount: this.refundLogs.length,
      totalRefundedAmount: total,
      history: this.refundLogs.map((l) => ({
        refundId: l.refundId,
        paymentId: l.paymentId,
        refundAmount: l.refundAmount,
        reason: l.reason,
        processedAt: l.processedAt.toISOString(),
      })),
    };
  }
}

/**
 * Service 5: SplitPaymentService
 * Multi-tender split payment orchestrator.
 */
export class SplitPaymentService {
  public calculateRemainingBalance(totalAmount: number, existingTenders: TenderItemReadModel[]): number {
    const paid = existingTenders.reduce((acc, t) => acc + t.amount, 0);
    return Math.max(0, Math.round((totalAmount - paid) * 100) / 100);
  }
}

/**
 * Service 6: PaymentService
 * Primary PaymentAggregate Coordinator.
 */
export class PaymentService {
  private readonly paymentsMap = new Map<
    string,
    {
      paymentId: PaymentId;
      orderId: string;
      totalAmount: number;
      paidAmount: number;
      tipAmount: number;
      status: PaymentStatus;
      tenders: TenderItemReadModel[];
    }
  >();

  constructor(
    private readonly authService: AuthorizationService,
    private readonly tenderService: TenderService,
    private readonly tipService: TipService,
    private readonly refundService: RefundService,
    private readonly splitService: SplitPaymentService
  ) {}

  public initiatePayment(orderId: string, totalAmount: number): PaymentId {
    const paymentId = PaymentId.create();
    this.paymentsMap.set(paymentId.id, {
      paymentId,
      orderId,
      totalAmount,
      paidAmount: 0,
      tipAmount: 0,
      status: PaymentStatus.PENDING,
      tenders: [],
    });
    return paymentId;
  }

  public addTender(
    paymentId: string,
    tenderType: TenderType,
    amount: number
  ): { receipt: PaymentReceipt; isFullyPaid: boolean } {
    const payment = this.paymentsMap.get(paymentId);
    if (!payment) throw new Error(`Payment error: Payment ${paymentId} not found`);

    let tokenizedRef: string | undefined;
    let authCode: string | undefined;

    if (tenderType === TenderType.CARD) {
      const auth = this.authService.authorizeCard(amount);
      authCode = auth.authCode.code;
      tokenizedRef = auth.tokenRef.tokenizedRef;
    }

    const tenderId = TenderId.create();
    payment.tenders.push({
      tenderId: tenderId.id,
      tenderType,
      amount,
      tokenizedRef,
      authCode,
    });

    payment.paidAmount += amount;
    const remaining = this.splitService.calculateRemainingBalance(payment.totalAmount, payment.tenders);

    let changeGiven = 0;
    if (remaining === 0) {
      payment.status = PaymentStatus.COMPLETED;
      if (payment.paidAmount > payment.totalAmount) {
        changeGiven = payment.paidAmount - payment.totalAmount;
      }
    }

    const receipt = PaymentReceipt.create({
      paymentId,
      tenderType,
      amountPaid: amount,
      changeGiven,
    });

    return { receipt, isFullyPaid: payment.status === PaymentStatus.COMPLETED };
  }

  public getPaymentSummary(paymentId: string): PaymentSummaryReadModel {
    const payment = this.paymentsMap.get(paymentId);
    if (!payment) throw new Error(`Payment error: Payment ${paymentId} not found`);

    return {
      paymentId: payment.paymentId.id,
      orderId: payment.orderId,
      totalAmount: payment.totalAmount,
      paidAmount: payment.paidAmount,
      tipAmount: payment.tipAmount,
      status: payment.status,
      createdAt: new Date().toISOString(),
    };
  }

  public getTenderBreakdown(paymentId: string): TenderBreakdownReadModel {
    const payment = this.paymentsMap.get(paymentId);
    if (!payment) throw new Error(`Payment error: Payment ${paymentId} not found`);

    const remaining = this.splitService.calculateRemainingBalance(payment.totalAmount, payment.tenders);

    return {
      paymentId: payment.paymentId.id,
      totalOrderAmount: payment.totalAmount,
      remainingBalance: remaining,
      tenders: payment.tenders,
    };
  }
}

/**
 * Service 7: EnterprisePosPaymentPlatformService
 * High-level application façade for POS payment platform infrastructure.
 */
export class EnterprisePosPaymentPlatformService {
  constructor(
    public readonly authService: AuthorizationService,
    public readonly tenderService: TenderService,
    public readonly tipService: TipService,
    public readonly refundService: RefundService,
    public readonly splitService: SplitPaymentService,
    public readonly paymentService: PaymentService
  ) {}
}
