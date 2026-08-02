/**
 * Enterprise Receipt & Fiscal Platform - Value Objects
 *
 * Immutable Value Objects encapsulating receipt IDs, fiscal receipt numbers, fiscal signatures,
 * fiscal provider IDs, receipt templates, line items, totals, tax breakdowns, and digital delivery details.
 */

import { FiscalStatus, ReceiptStatus } from '../enums/pos-receipt-fiscal.enums';

/**
 * Identifiers: ReceiptId, ReceiptNumber, FiscalReceiptNumber, FiscalTransactionId, FiscalProviderId
 */
export class ReceiptId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): ReceiptId {
    return new ReceiptId(id || `rcpt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }
}

export class ReceiptNumber {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value?: string): ReceiptNumber {
    return new ReceiptNumber(value || `R-${Math.floor(10000 + Math.random() * 90000)}`);
  }
}

export class FiscalReceiptNumber {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value?: string): FiscalReceiptNumber {
    return new FiscalReceiptNumber(value || `FISC-${Math.floor(100000 + Math.random() * 900000)}`);
  }
}

export class FiscalTransactionId {
  public readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(id?: string): FiscalTransactionId {
    return new FiscalTransactionId(id || `tx-fisc-${Date.now()}`);
  }
}

export class FiscalProviderId {
  public readonly providerId: string;
  public readonly providerName: string; // HDM_ARMENIA, FISCAL_DEVICE, GOVT_API, CLOUD_SERVICE

  private constructor(providerId: string, providerName: string) {
    this.providerId = providerId;
    this.providerName = providerName;
  }

  public static create(providerId: string = 'hdm-armenia-01', providerName: string = 'HDM_ARMENIA'): FiscalProviderId {
    return new FiscalProviderId(providerId, providerName);
  }
}

/**
 * ReceiptTemplate & ReceiptLine & TaxBreakdown & ReceiptTotals
 */
export class ReceiptTemplate {
  public readonly templateId: string;
  public readonly countryCode: string;
  public readonly layoutName: string;

  private constructor(templateId: string, countryCode: string, layoutName: string) {
    this.templateId = templateId;
    this.countryCode = countryCode;
    this.layoutName = layoutName;
  }

  public static create(templateId: string = 'tmpl-default', countryCode: string = 'US', layoutName: string = 'Standard Thermal'): ReceiptTemplate {
    return new ReceiptTemplate(templateId, countryCode, layoutName);
  }
}

export class ReceiptLine {
  public readonly productName: string;
  public readonly quantity: number;
  public readonly unitPrice: number;
  public readonly lineTotal: number;

  private constructor(productName: string, quantity: number, unitPrice: number) {
    this.productName = productName;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.lineTotal = Math.round(quantity * unitPrice * 100) / 100;
  }

  public static create(productName: string, quantity: number, unitPrice: number): ReceiptLine {
    return new ReceiptLine(productName, quantity, unitPrice);
  }
}

export class TaxBreakdown {
  public readonly taxCategory: string;
  public readonly taxRate: number;
  public readonly taxAmount: number;

  private constructor(taxCategory: string, taxRate: number, taxAmount: number) {
    this.taxCategory = taxCategory;
    this.taxRate = taxRate;
    this.taxAmount = taxAmount;
  }

  public static create(taxCategory: string = 'VAT', taxRate: number = 0.1, taxAmount: number = 0): TaxBreakdown {
    return new TaxBreakdown(taxCategory, taxRate, taxAmount);
  }
}

export class ReceiptTotals {
  public readonly subtotal: number;
  public readonly taxTotal: number;
  public readonly grandTotal: number;

  private constructor(subtotal: number, taxTotal: number) {
    this.subtotal = subtotal;
    this.taxTotal = taxTotal;
    this.grandTotal = Math.round((subtotal + taxTotal) * 100) / 100;
  }

  public static create(subtotal: number, taxTotal: number): ReceiptTotals {
    return new ReceiptTotals(subtotal, taxTotal);
  }
}

/**
 * FiscalSignature & ReceiptDelivery Value Objects
 */
export class FiscalSignature {
  public readonly signatureHash: string;
  public readonly signedAt: Date;

  private constructor(signatureHash: string) {
    this.signatureHash = signatureHash;
    this.signedAt = new Date();
  }

  public static create(signatureHash?: string): FiscalSignature {
    return new FiscalSignature(signatureHash || `SHA256:${Math.random().toString(36).substring(2, 14)}`);
  }
}

export class ReceiptDelivery {
  public readonly channel: 'EMAIL' | 'SMS' | 'QR';
  public readonly destination: string;

  private constructor(channel: 'EMAIL' | 'SMS' | 'QR', destination: string) {
    this.channel = channel;
    this.destination = destination;
  }

  public static create(channel: 'EMAIL' | 'SMS' | 'QR', destination: string): ReceiptDelivery {
    return new ReceiptDelivery(channel, destination);
  }
}
