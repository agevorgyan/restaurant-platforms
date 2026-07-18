import { IPurchaseOrderRepository } from '../repositories/purchase-order.repository.interface';
import { ISupplierRepository } from '../repositories/supplier.repository.interface';
import { IPurchaseOrder } from '../entities/purchase-order.interface';
import { IPurchaseOrderLine } from '../entities/purchase-order-line.interface';
import { PurchaseOrderStatus } from '../value-objects/purchase-order-status.value-object';
import { ApprovalStatus } from '../value-objects/approval-status.value-object';
import { PurchaseOrderNumber } from '../value-objects/purchase-order-number.value-object';
import { ExpectedDeliveryDate } from '../value-objects/expected-delivery-date.value-object';
import { DeliveryTerms } from '../value-objects/delivery-terms.value-object';
import { PurchaseOrderTotals } from '../value-objects/purchase-order-totals.value-object';
import { CreatePurchaseOrderDto, ReceivePurchaseOrderLineDto } from '../../application/dto/purchase-order.dto';
import {
  PurchaseOrderCreatedEvent,
  PurchaseOrderSubmittedEvent,
  PurchaseOrderApprovedEvent,
  PurchaseOrderRejectedEvent,
  PurchaseOrderCancelledEvent,
  PurchaseOrderPartiallyReceivedEvent,
  PurchaseOrderCompletedEvent
} from '../events/purchase-order.events';

export class PurchaseOrderDomainService {
  constructor(
    private readonly purchaseOrderRepository: IPurchaseOrderRepository,
    private readonly supplierRepository: ISupplierRepository
  ) {}

  private calculateTotals(lines: IPurchaseOrderLine[]): PurchaseOrderTotals {
    let subtotal = 0;
    let discount = 0;
    let tax = 0;

    for (const line of lines) {
      subtotal += line.orderedQuantity * line.unitPrice;
      discount += line.discount;
      const lineSubtotalAfterDiscount = (line.orderedQuantity * line.unitPrice) - line.discount;
      tax += lineSubtotalAfterDiscount * (line.taxRate / 100);
      
      line.lineTotal = lineSubtotalAfterDiscount + (lineSubtotalAfterDiscount * (line.taxRate / 100));
    }

    return new PurchaseOrderTotals(subtotal, discount, tax);
  }

  async createPurchaseOrder(id: string, dto: CreatePurchaseOrderDto): Promise<IPurchaseOrder> {
    const existingPo = await this.purchaseOrderRepository.findByOrderNumber(dto.restaurantId, dto.purchaseOrderNumber);
    if (existingPo) {
      throw new Error(`Purchase order number ${dto.purchaseOrderNumber} already exists`);
    }

    const supplier = await this.supplierRepository.findById(dto.supplierId);
    if (!supplier) {
      throw new Error('Supplier not found');
    }
    if (!supplier.status.isActive()) {
      throw new Error('Purchase order can only reference an Active supplier');
    }

    const lines: IPurchaseOrderLine[] = dto.lines.map(l => ({
      ingredientId: l.ingredientId,
      description: l.description,
      orderedQuantity: l.orderedQuantity,
      receivedQuantity: 0,
      unitOfMeasure: l.unitOfMeasure,
      unitPrice: l.unitPrice,
      discount: l.discount,
      taxRate: l.taxRate,
      lineTotal: 0 
    }));

    const totals = this.calculateTotals(lines);

    const po: IPurchaseOrder = {
      id,
      restaurantId: dto.restaurantId,
      supplierId: dto.supplierId,
      purchaseOrderNumber: new PurchaseOrderNumber(dto.purchaseOrderNumber),
      status: new PurchaseOrderStatus('Draft'),
      approvalStatus: new ApprovalStatus('Pending'),
      currency: dto.currency,
      expectedDeliveryDate: dto.expectedDeliveryDate ? new ExpectedDeliveryDate(dto.expectedDeliveryDate) : undefined,
      deliveryTerms: dto.deliveryTerms ? new DeliveryTerms(dto.deliveryTerms) : undefined,
      lines,
      totals,
      notes: dto.notes,
      domainEvents: [new PurchaseOrderCreatedEvent(id, dto.restaurantId)],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.purchaseOrderRepository.save(po);
    return po;
  }

  async submitPurchaseOrder(id: string): Promise<IPurchaseOrder> {
    const po = await this.purchaseOrderRepository.findById(id);
    if (!po) throw new Error('Purchase order not found');
    if (!po.status.isDraft()) throw new Error('Only Draft orders can be submitted');

    po.status = new PurchaseOrderStatus('Submitted');
    po.domainEvents = po.domainEvents || [];
    po.domainEvents.push(new PurchaseOrderSubmittedEvent(po.id, po.restaurantId));
    po.updatedAt = new Date();
    await this.purchaseOrderRepository.save(po);
    return po;
  }

  async approvePurchaseOrder(id: string): Promise<IPurchaseOrder> {
    const po = await this.purchaseOrderRepository.findById(id);
    if (!po) throw new Error('Purchase order not found');
    if (!po.status.isSubmitted()) throw new Error('Only Submitted orders may be approved');

    po.approvalStatus = new ApprovalStatus('Approved');
    po.status = new PurchaseOrderStatus('Approved');
    po.domainEvents = po.domainEvents || [];
    po.domainEvents.push(new PurchaseOrderApprovedEvent(po.id, po.restaurantId));
    po.updatedAt = new Date();
    await this.purchaseOrderRepository.save(po);
    return po;
  }

  async rejectPurchaseOrder(id: string): Promise<IPurchaseOrder> {
    const po = await this.purchaseOrderRepository.findById(id);
    if (!po) throw new Error('Purchase order not found');
    if (!po.status.isSubmitted()) throw new Error('Only Submitted orders may be rejected');

    po.approvalStatus = new ApprovalStatus('Rejected');
    po.status = new PurchaseOrderStatus('Draft'); 
    po.domainEvents = po.domainEvents || [];
    po.domainEvents.push(new PurchaseOrderRejectedEvent(po.id, po.restaurantId));
    po.updatedAt = new Date();
    await this.purchaseOrderRepository.save(po);
    return po;
  }

  async cancelPurchaseOrder(id: string): Promise<IPurchaseOrder> {
    const po = await this.purchaseOrderRepository.findById(id);
    if (!po) throw new Error('Purchase order not found');
    if (po.status.isCompleted()) throw new Error('Completed purchase orders are immutable');
    if (po.status.isCancelled()) throw new Error('Purchase order is already cancelled');

    po.status = new PurchaseOrderStatus('Cancelled');
    po.domainEvents = po.domainEvents || [];
    po.domainEvents.push(new PurchaseOrderCancelledEvent(po.id, po.restaurantId));
    po.updatedAt = new Date();
    await this.purchaseOrderRepository.save(po);
    return po;
  }

  async receiveGoods(id: string, receives: ReceivePurchaseOrderLineDto[]): Promise<IPurchaseOrder> {
    const po = await this.purchaseOrderRepository.findById(id);
    if (!po) throw new Error('Purchase order not found');
    
    if (po.status.isCompleted()) throw new Error('Completed purchase orders are immutable');
    if (po.status.isCancelled()) throw new Error('Cancelled purchase orders are terminal');
    if (!po.status.isApproved() && !po.status.isPartiallyReceived()) {
      throw new Error('Only Approved or PartiallyReceived orders may receive goods');
    }

    for (const receive of receives) {
      const line = po.lines.find(l => l.ingredientId === receive.ingredientId);
      if (!line) throw new Error(`Line with ingredient ${receive.ingredientId} not found`);
      
      if (receive.receivedQuantity < 0) throw new Error('Received quantity cannot be negative');
      
      const newReceived = line.receivedQuantity + receive.receivedQuantity;
      if (newReceived > line.orderedQuantity) {
        throw new Error(`Received quantity cannot exceed ordered quantity for ingredient ${receive.ingredientId}`);
      }
      
      line.receivedQuantity = newReceived;
    }

    const allFullyReceived = po.lines.every(l => l.receivedQuantity === l.orderedQuantity);
    const someReceived = po.lines.some(l => l.receivedQuantity > 0);

    po.domainEvents = po.domainEvents || [];
    if (allFullyReceived) {
      po.status = new PurchaseOrderStatus('Completed');
      po.domainEvents.push(new PurchaseOrderCompletedEvent(po.id, po.restaurantId));
    } else if (someReceived) {
      po.status = new PurchaseOrderStatus('PartiallyReceived');
      po.domainEvents.push(new PurchaseOrderPartiallyReceivedEvent(po.id, po.restaurantId));
    }

    po.updatedAt = new Date();
    await this.purchaseOrderRepository.save(po);
    return po;
  }
}
