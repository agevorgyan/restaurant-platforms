export class ReceiptSource {
  constructor(public readonly purchaseOrderId: string) {
    if (!purchaseOrderId || purchaseOrderId.trim() === '') {
      throw new Error('Receipt source must reference a purchase order');
    }
  }
}
