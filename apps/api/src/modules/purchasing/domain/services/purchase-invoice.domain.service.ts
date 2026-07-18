import { IPurchaseInvoiceRepository } from '../repositories/purchase-invoice.repository.interface';
import { ISupplierRepository } from '../repositories/supplier.repository.interface';
import { IPurchaseInvoice } from '../entities/purchase-invoice.interface';
import { IPurchaseInvoiceLine } from '../entities/purchase-invoice-line.interface';
import { InvoiceStatus } from '../value-objects/invoice-status.value-object';
import { InvoiceNumber } from '../value-objects/invoice-number.value-object';
import { DueDate } from '../value-objects/due-date.value-object';
import { InvoiceTotals } from '../value-objects/invoice-totals.value-object';
import { CreatePurchaseInvoiceDto } from '../../application/dto/purchase-invoice.dto';

export class PurchaseInvoiceDomainService {
  constructor(
    private readonly purchaseInvoiceRepository: IPurchaseInvoiceRepository,
    private readonly supplierRepository: ISupplierRepository
  ) {}

  private calculateTotals(lines: IPurchaseInvoiceLine[]): InvoiceTotals {
    let subtotal = 0;
    let tax = 0;
    let discount = 0;

    for (const line of lines) {
      subtotal += line.quantity * line.unitPrice;
      discount += line.discount;
      
      const lineSubtotalAfterDiscount = (line.quantity * line.unitPrice) - line.discount;
      const lineTax = lineSubtotalAfterDiscount * (line.taxRate / 100);
      tax += lineTax;
      
      line.lineTotal = lineSubtotalAfterDiscount + lineTax;
    }

    return new InvoiceTotals(subtotal, tax, discount);
  }

  async createPurchaseInvoice(id: string, dto: CreatePurchaseInvoiceDto): Promise<IPurchaseInvoice> {
    const existingInvoice = await this.purchaseInvoiceRepository.findByInvoiceNumber(dto.restaurantId, dto.invoiceNumber);
    if (existingInvoice) {
      throw new Error(`Invoice number ${dto.invoiceNumber} already exists`);
    }

    const existingSupplierInvoice = await this.purchaseInvoiceRepository.findBySupplierInvoiceNumber(dto.supplierId, dto.supplierInvoiceNumber);
    if (existingSupplierInvoice) {
      throw new Error(`Supplier invoice number ${dto.supplierInvoiceNumber} already exists for this supplier`);
    }

    const supplier = await this.supplierRepository.findById(dto.supplierId);
    if (!supplier) {
      throw new Error('Supplier not found');
    }

    const lines: IPurchaseInvoiceLine[] = dto.lines.map(l => ({
      purchaseOrderLineId: l.purchaseOrderLineId,
      ingredientId: l.ingredientId,
      description: l.description,
      quantity: l.quantity,
      unitOfMeasure: l.unitOfMeasure,
      unitPrice: l.unitPrice,
      discount: l.discount,
      taxRate: l.taxRate,
      lineTotal: 0
    }));

    const totals = this.calculateTotals(lines);

    const invoice: IPurchaseInvoice = {
      id,
      restaurantId: dto.restaurantId,
      supplierId: dto.supplierId,
      purchaseOrderId: dto.purchaseOrderId,
      goodsReceiptId: dto.goodsReceiptId,
      invoiceNumber: new InvoiceNumber(dto.invoiceNumber),
      supplierInvoiceNumber: dto.supplierInvoiceNumber,
      status: new InvoiceStatus('Draft'),
      invoiceDate: dto.invoiceDate,
      dueDate: new DueDate(dto.dueDate),
      currency: dto.currency,
      lines,
      subtotal: totals.subtotal,
      tax: totals.tax,
      discount: totals.discount,
      total: totals.total,
      notes: dto.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.purchaseInvoiceRepository.save(invoice);
    return invoice;
  }

  async postPurchaseInvoice(id: string): Promise<IPurchaseInvoice> {
    const invoice = await this.purchaseInvoiceRepository.findById(id);
    if (!invoice) throw new Error('Purchase invoice not found');
    
    if (invoice.status.isPosted()) throw new Error('Posted invoices are immutable');
    if (invoice.status.isMatched()) throw new Error('Matched invoices cannot be modified');
    if (invoice.status.isCancelled()) throw new Error('Cancelled invoices are terminal');

    invoice.status = new InvoiceStatus('Posted');
    invoice.updatedAt = new Date();
    await this.purchaseInvoiceRepository.save(invoice);
    return invoice;
  }

  async matchPurchaseInvoice(id: string): Promise<IPurchaseInvoice> {
    const invoice = await this.purchaseInvoiceRepository.findById(id);
    if (!invoice) throw new Error('Purchase invoice not found');
    
    if (invoice.status.isCancelled()) throw new Error('Cancelled invoices are terminal');
    if (invoice.status.isMatched()) throw new Error('Invoice is already matched');
    if (!invoice.status.isPosted()) throw new Error('Only posted invoices can be matched');

    invoice.status = new InvoiceStatus('Matched');
    invoice.updatedAt = new Date();
    await this.purchaseInvoiceRepository.save(invoice);
    return invoice;
  }

  async cancelPurchaseInvoice(id: string): Promise<IPurchaseInvoice> {
    const invoice = await this.purchaseInvoiceRepository.findById(id);
    if (!invoice) throw new Error('Purchase invoice not found');
    
    if (invoice.status.isCancelled()) throw new Error('Invoice is already cancelled');
    if (invoice.status.isPosted()) throw new Error('Posted invoices are immutable');
    if (invoice.status.isMatched()) throw new Error('Matched invoices cannot be modified');

    invoice.status = new InvoiceStatus('Cancelled');
    invoice.updatedAt = new Date();
    await this.purchaseInvoiceRepository.save(invoice);
    return invoice;
  }
}
