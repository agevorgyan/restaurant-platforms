/**
 * Enterprise Receipt & Fiscal Platform - Fiscal Provider Port Interface
 *
 * Hexagonal Architecture Port interface for country-specific fiscal device adapters.
 */

import { FiscalSignature } from '../value-objects/pos-receipt-fiscal-vo';

export interface FiscalizationRequest {
  receiptId: string;
  orderId: string;
  amount: number;
  taxAmount: number;
  items: Array<{ name: string; qty: number; price: number }>;
}

export interface FiscalizationResponse {
  isSuccess: boolean;
  fiscalReceiptNumber: string;
  fiscalTransactionId: string;
  signature: FiscalSignature;
  qrCodeData?: string;
  errorMessage?: string;
}

export interface FiscalProviderPort {
  readonly providerId: string;
  readonly providerName: string;

  fiscalizeReceipt(request: FiscalizationRequest): Promise<FiscalizationResponse>;
}
