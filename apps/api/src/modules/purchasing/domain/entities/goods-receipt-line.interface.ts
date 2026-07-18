import { LotInformation } from '../value-objects/lot-information.value-object';
import { ExpirationInformation } from '../value-objects/expiration-information.value-object';

export interface IGoodsReceiptLine {
  purchaseOrderLineId: string;
  ingredientId: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  unitOfMeasure: string;
  lotInformation?: LotInformation;
  expirationInformation?: ExpirationInformation;
  comment?: string;
}
