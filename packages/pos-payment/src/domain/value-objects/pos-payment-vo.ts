/**
 * Enterprise POS Payment Platform - Value Objects
 *
 * Immutable Value Objects encapsulating payment IDs, tender IDs, tokenized references,
 * authorization codes, tips, gratuity, cash change due, refunds, and payment receipts.
 */

import { PaymentStatus, TenderType } from '../enums/pos-payment.enums';

/**
 * PaymentId & TenderId Value Objects
 */
export class PaymentId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): PaymentId {
    return new PaymentId(id || `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

export class TenderId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): TenderId {
    return new TenderId(id || `tnd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

/**
 * Tokenized References (PCI Compliant - Zero PAN/CVV Storage)
 */
export class AuthorizationCode {
  public readonly code: string;

  private constructor(code: string) {
    this.code = code;
  }

  public static create(code?: string): AuthorizationCode {
    return new AuthorizationCode(code || `AUTH-${Math.floor(100000 + Math.random() * 900000)}`);
  }
}

export class TransactionReference {
  public readonly tokenizedRef: string;

  private constructor(tokenizedRef: string) {
    this.tokenizedRef = tokenizedRef;
  }

  public static create(tokenizedRef?: string): TransactionReference {
    return new TransactionReference(tokenizedRef || `tok_ref_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);
  }
}

/**
 * Amounts: TenderAmount, TipAmount, Gratuity, ChangeAmount, RefundAmount
 */
export class TenderAmount {
  public readonly amount: number;

  private constructor(amount: number) {
    if (amount < 0) throw new Error('Tender amount cannot be negative');
    this.amount = Math.round(amount * 100) / 100;
  }

  public static create(amount: number): TenderAmount {
    return new TenderAmount(amount);
  }
}

export class TipAmount {
  public readonly amount: number;

  private constructor(amount: number) {
    this.amount = Math.max(0, Math.round(amount * 100) / 100);
  }

  public static create(amount: number = 0): TipAmount {
    return new TipAmount(amount);
  }
}

export class Gratuity {
  public readonly amount: number;

  private constructor(amount: number) {
    this.amount = Math.max(0, Math.round(amount * 100) / 100);
  }

  public static create(amount: number = 0): Gratuity {
    return new Gratuity(amount);
  }
}

export class ChangeAmount {
  public readonly amount: number;

  private constructor(amount: number) {
    this.amount = Math.max(0, Math.round(amount * 100) / 100);
  }

  public static calculate(totalDue: number, tenderedAmount: number): ChangeAmount {
    return new ChangeAmount(tenderedAmount - totalDue);
  }
}

export class RefundAmount {
  public readonly amount: number;

  private constructor(amount: number) {
    if (amount <= 0) throw new Error('Refund amount must be greater than zero');
    this.amount = Math.round(amount * 100) / 100;
  }

  public static create(amount: number): RefundAmount {
    return new RefundAmount(amount);
  }
}

/**
 * PaymentReceipt Value Object
 */
export class PaymentReceipt {
  public readonly receiptId: string;
  public readonly paymentId: string;
  public readonly tenderType: TenderType;
  public readonly amountPaid: number;
  public readonly changeGiven: number;
  public readonly maskCardNo?: string;
  public readonly timestamp: Date;

  private constructor(props: {
    receiptId: string;
    paymentId: string;
    tenderType: TenderType;
    amountPaid: number;
    changeGiven: number;
    maskCardNo?: string;
  }) {
    this.receiptId = props.receiptId;
    this.paymentId = props.paymentId;
    this.tenderType = props.tenderType;
    this.amountPaid = props.amountPaid;
    this.changeGiven = props.changeGiven;
    this.maskCardNo = props.maskCardNo;
    this.timestamp = new Date();
  }

  public static create(props: {
    paymentId: string;
    tenderType: TenderType;
    amountPaid: number;
    changeGiven?: number;
    maskCardNo?: string;
  }): PaymentReceipt {
    return new PaymentReceipt({
      receiptId: `rcpt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      paymentId: props.paymentId,
      tenderType: props.tenderType,
      amountPaid: props.amountPaid,
      changeGiven: props.changeGiven || 0,
      maskCardNo: props.maskCardNo || '**** **** **** 4242',
    });
  }
}
