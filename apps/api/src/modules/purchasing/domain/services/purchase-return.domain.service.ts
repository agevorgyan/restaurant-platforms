import { IPurchaseReturnRepository } from '../repositories/purchase-return.repository.interface';
import { IGoodsReceiptRepository } from '../repositories/goods-receipt.repository.interface';
import { IPurchaseReturn } from '../entities/purchase-return.interface';
import { IPurchaseReturnLine } from '../entities/purchase-return-line.interface';
import { ReturnStatus } from '../value-objects/return-status.value-object';
import { ReturnNumber } from '../value-objects/return-number.value-object';
import { ReturnReason, ReturnReasonValue } from '../value-objects/return-reason.value-object';
import { ReturnAuthorization } from '../value-objects/return-authorization.value-object';
import { SupplierCreditReference } from '../value-objects/supplier-credit-reference.value-object';
import { CreatePurchaseReturnDto } from '../../application/dto/purchase-return.dto';

export class PurchaseReturnDomainService {
  constructor(
    private readonly purchaseReturnRepository: IPurchaseReturnRepository,
    private readonly goodsReceiptRepository: IGoodsReceiptRepository
  ) {}

  async createPurchaseReturn(id: string, dto: CreatePurchaseReturnDto): Promise<IPurchaseReturn> {
    const existingReturn = await this.purchaseReturnRepository.findByReturnNumber(dto.restaurantId, dto.returnNumber);
    if (existingReturn) {
      throw new Error(`Return number ${dto.returnNumber} already exists`);
    }

    const goodsReceipt = await this.goodsReceiptRepository.findById(dto.goodsReceiptId);
    if (!goodsReceipt) {
      throw new Error('Goods receipt not found');
    }

    const lines: IPurchaseReturnLine[] = dto.lines.map(l => {
      // Find the corresponding line in the goods receipt
      // To strictly follow the rules, the GoodsReceipt line identifier would ideally match the goodsReceiptLineId passed in.
      // But GoodsReceipt lines don't have an explicit 'id' in our interface, they just have purchaseOrderLineId and ingredientId.
      // Assuming 'goodsReceiptLineId' from DTO corresponds to 'ingredientId' or the system maps it correctly,
      // here we match by ingredientId (which essentially uniquely identifies a line in the goods receipt for our model).
      const grLine = goodsReceipt.lines.find(grl => grl.ingredientId === l.ingredientId);
      
      if (!grLine) {
        throw new Error(`Goods receipt line for ingredient ${l.ingredientId} not found in the referenced goods receipt`);
      }

      if (l.returnedQuantity > grLine.receivedQuantity) {
        throw new Error(`Returned quantity cannot exceed the quantity received on the referenced goods receipt line for ingredient ${l.ingredientId}`);
      }

      return {
        goodsReceiptLineId: l.goodsReceiptLineId,
        ingredientId: l.ingredientId,
        returnedQuantity: l.returnedQuantity,
        acceptedReturnQuantity: l.acceptedReturnQuantity,
        unitOfMeasure: l.unitOfMeasure,
        comment: l.comment
      };
    });

    const purchaseReturn: IPurchaseReturn = {
      id,
      restaurantId: dto.restaurantId,
      supplierId: dto.supplierId,
      goodsReceiptId: dto.goodsReceiptId,
      purchaseInvoiceId: dto.purchaseInvoiceId,
      returnNumber: new ReturnNumber(dto.returnNumber),
      reason: new ReturnReason(dto.reason as ReturnReasonValue),
      status: new ReturnStatus('Draft'),
      returnDate: dto.returnDate,
      notes: dto.notes,
      lines,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.purchaseReturnRepository.save(purchaseReturn);
    return purchaseReturn;
  }

  async authorizePurchaseReturn(id: string, authorizationCode: string, authorizedBy: string, authorizedAt: Date): Promise<IPurchaseReturn> {
    const purchaseReturn = await this.purchaseReturnRepository.findById(id);
    if (!purchaseReturn) throw new Error('Purchase return not found');
    
    if (!purchaseReturn.status.isDraft()) {
      throw new Error('Only Draft returns may be authorized');
    }

    purchaseReturn.authorization = new ReturnAuthorization(authorizationCode, authorizedBy, authorizedAt);
    purchaseReturn.status = new ReturnStatus('Authorized');
    purchaseReturn.updatedAt = new Date();
    await this.purchaseReturnRepository.save(purchaseReturn);
    return purchaseReturn;
  }

  async postPurchaseReturn(id: string, supplierCreditReference?: string): Promise<IPurchaseReturn> {
    const purchaseReturn = await this.purchaseReturnRepository.findById(id);
    if (!purchaseReturn) throw new Error('Purchase return not found');
    
    if (!purchaseReturn.status.isAuthorized()) throw new Error('Only Authorized returns may be posted');
    
    if (supplierCreditReference) {
      purchaseReturn.supplierCreditReference = new SupplierCreditReference(supplierCreditReference);
    }

    purchaseReturn.status = new ReturnStatus('Posted');
    purchaseReturn.updatedAt = new Date();
    await this.purchaseReturnRepository.save(purchaseReturn);
    return purchaseReturn;
  }

  async cancelPurchaseReturn(id: string): Promise<IPurchaseReturn> {
    const purchaseReturn = await this.purchaseReturnRepository.findById(id);
    if (!purchaseReturn) throw new Error('Purchase return not found');
    
    if (purchaseReturn.status.isPosted()) throw new Error('Posted returns are immutable');
    if (purchaseReturn.status.isCancelled()) throw new Error('Return is already cancelled');

    purchaseReturn.status = new ReturnStatus('Cancelled');
    purchaseReturn.updatedAt = new Date();
    await this.purchaseReturnRepository.save(purchaseReturn);
    return purchaseReturn;
  }
}
