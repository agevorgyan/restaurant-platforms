import { IGoodsReceiptRepository } from '../repositories/goods-receipt.repository.interface';
import { IPurchaseOrderRepository } from '../repositories/purchase-order.repository.interface';
import { IGoodsReceipt } from '../entities/goods-receipt.interface';
import { IGoodsReceiptLine } from '../entities/goods-receipt-line.interface';
import { GoodsReceiptStatus } from '../value-objects/goods-receipt-status.value-object';
import { ReceiptNumber } from '../value-objects/receipt-number.value-object';
import { LotInformation } from '../value-objects/lot-information.value-object';
import { ExpirationInformation } from '../value-objects/expiration-information.value-object';
import { CreateGoodsReceiptDto } from '../../application/dto/goods-receipt.dto';

export class GoodsReceiptDomainService {
  constructor(
    private readonly goodsReceiptRepository: IGoodsReceiptRepository,
    private readonly purchaseOrderRepository: IPurchaseOrderRepository
  ) {}

  async createGoodsReceipt(id: string, dto: CreateGoodsReceiptDto): Promise<IGoodsReceipt> {
    const existingReceipt = await this.goodsReceiptRepository.findByReceiptNumber(dto.restaurantId, dto.receiptNumber);
    if (existingReceipt) {
      throw new Error(`Receipt number ${dto.receiptNumber} already exists`);
    }

    const purchaseOrder = await this.purchaseOrderRepository.findById(dto.purchaseOrderId);
    if (!purchaseOrder) {
      throw new Error('Purchase order not found');
    }

    const lines: IGoodsReceiptLine[] = dto.lines.map(l => {
      // Validate that the line references an actual line in the PO
      const poLine = purchaseOrder.lines.find(pol => pol.ingredientId === l.ingredientId);
      if (!poLine) {
        throw new Error(`Purchase order line for ingredient ${l.ingredientId} not found in the purchase order`);
      }

      return {
        purchaseOrderLineId: l.purchaseOrderLineId,
        ingredientId: l.ingredientId,
        orderedQuantity: l.orderedQuantity,
        receivedQuantity: l.receivedQuantity,
        acceptedQuantity: l.acceptedQuantity,
        rejectedQuantity: l.rejectedQuantity,
        unitOfMeasure: l.unitOfMeasure,
        lotInformation: l.lotNumber ? new LotInformation(l.lotNumber) : undefined,
        expirationInformation: l.expirationDate ? new ExpirationInformation(l.expirationDate) : undefined,
        comment: l.comment
      };
    });

    const receipt: IGoodsReceipt = {
      id,
      restaurantId: dto.restaurantId,
      purchaseOrderId: dto.purchaseOrderId,
      receiptNumber: new ReceiptNumber(dto.receiptNumber),
      status: new GoodsReceiptStatus('Draft'),
      receiptDate: dto.receiptDate,
      supplierDeliveryNote: dto.supplierDeliveryNote,
      receivedBy: dto.receivedBy,
      notes: dto.notes,
      lines,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.goodsReceiptRepository.save(receipt);
    return receipt;
  }

  async postGoodsReceipt(id: string): Promise<IGoodsReceipt> {
    const receipt = await this.goodsReceiptRepository.findById(id);
    if (!receipt) throw new Error('Goods receipt not found');
    
    if (receipt.status.isPosted()) throw new Error('Posted receipts are immutable');
    if (receipt.status.isCancelled()) throw new Error('Cancelled receipts are terminal');

    receipt.status = new GoodsReceiptStatus('Posted');
    receipt.updatedAt = new Date();
    await this.goodsReceiptRepository.save(receipt);
    return receipt;
  }

  async cancelGoodsReceipt(id: string): Promise<IGoodsReceipt> {
    const receipt = await this.goodsReceiptRepository.findById(id);
    if (!receipt) throw new Error('Goods receipt not found');
    
    if (receipt.status.isPosted()) throw new Error('Posted receipts are immutable');
    if (receipt.status.isCancelled()) throw new Error('Receipt is already cancelled');

    receipt.status = new GoodsReceiptStatus('Cancelled');
    receipt.updatedAt = new Date();
    await this.goodsReceiptRepository.save(receipt);
    return receipt;
  }
}
