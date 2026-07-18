import { ReturnNumber } from '../value-objects/return-number.value-object';
import { ReturnReason } from '../value-objects/return-reason.value-object';
import { ReturnStatus } from '../value-objects/return-status.value-object';
import { ReturnAuthorization } from '../value-objects/return-authorization.value-object';
import { SupplierCreditReference } from '../value-objects/supplier-credit-reference.value-object';
import { IPurchaseReturnLine } from './purchase-return-line.interface';

export interface IPurchaseReturn {
  id: string;
  restaurantId: string;
  supplierId: string;
  goodsReceiptId: string;
  purchaseInvoiceId?: string;
  returnNumber: ReturnNumber;
  reason: ReturnReason;
  status: ReturnStatus;
  authorization?: ReturnAuthorization;
  supplierCreditReference?: SupplierCreditReference;
  returnDate: Date;
  notes?: string;
  lines: IPurchaseReturnLine[];
  createdAt: Date;
  updatedAt: Date;
}
