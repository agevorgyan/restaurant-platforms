import { PurchaseOrderStatus } from '../value-objects/purchase-order-status.value-object';
import { ApprovalStatus } from '../value-objects/approval-status.value-object';
import { PurchaseOrderNumber } from '../value-objects/purchase-order-number.value-object';
import { ExpectedDeliveryDate } from '../value-objects/expected-delivery-date.value-object';
import { DeliveryTerms } from '../value-objects/delivery-terms.value-object';
import { PurchaseOrderTotals } from '../value-objects/purchase-order-totals.value-object';
import { IPurchaseOrderLine } from './purchase-order-line.interface';
import { IDomainEvent } from '../events/domain-event.interface';

export interface IPurchaseOrder {
  id: string;
  restaurantId: string;
  supplierId: string;
  purchaseOrderNumber: PurchaseOrderNumber;
  status: PurchaseOrderStatus;
  approvalStatus: ApprovalStatus;
  currency: string;
  expectedDeliveryDate?: ExpectedDeliveryDate;
  deliveryTerms?: DeliveryTerms;
  lines: IPurchaseOrderLine[];
  totals: PurchaseOrderTotals;
  notes?: string;
  domainEvents?: IDomainEvent[];
  createdAt: Date;
  updatedAt: Date;
}
