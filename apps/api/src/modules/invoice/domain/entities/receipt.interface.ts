import { DocumentNumber } from '../value-objects/document-number.value-object';
import { DocumentStatus } from '../value-objects/document-status.value-object';

export interface IReceipt {
  id: string;
  restaurantId: string;
  paymentId: string;
  documentNumber: DocumentNumber;
  paymentReference: string;
  amount: number;
  currency: string;
  status: DocumentStatus;
  issuedAt?: Date;
  voidedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
