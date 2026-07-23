import { GoodsReceipt } from '../../aggregates/goods-receipt.aggregate';
import { PurchaseOrder } from '../../aggregates/purchase-order.aggregate';
import { ReceivingPolicy } from '../../policies/workflow.policy';

export class ReceivingCoordinator {
  public validateReceivingCompletion(goodsReceipt: GoodsReceipt): void {
    ReceivingPolicy.ensureReceiptCompleteBeforeWorkflowEnd(goodsReceipt.status);
  }

  public coordinateGoodsReceiptCompletion(goodsReceipt: GoodsReceipt, purchaseOrder: PurchaseOrder): void {
    this.validateReceivingCompletion(goodsReceipt);
    
    // Orchestrates completion using Aggregate APIs
    purchaseOrder.markFullyReceived();
    // In a full implementation, it might also trigger downstream integration events here.
  }
}