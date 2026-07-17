import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';
import { IReceiptRepository } from '../../domain/repositories/receipt.repository.interface';
import { IssueInvoiceDto, IssueReceiptDto } from '../../application/dto/document.dto';
import { validateIssueInvoice, validateIssueReceipt } from '../../application/validation/document.schema';
import { DocumentNumber } from '../../domain/value-objects/document-number.value-object';
import { DocumentStatus } from '../../domain/value-objects/document-status.value-object';
import { CustomerSnapshot } from '../../domain/value-objects/customer-snapshot.value-object';
import { TaxSummary } from '../../domain/value-objects/tax-summary.value-object';
import { IInvoice } from '../../domain/entities/invoice.interface';
import { IReceipt } from '../../domain/entities/receipt.interface';
import {
  InvoiceIssuedEvent,
  InvoiceCancelledEvent,
  ReceiptIssuedEvent,
  ReceiptVoidedEvent
} from '../../domain/events/document.events';

@Injectable()
export class DocumentDomainService {
  constructor(
    private readonly invoiceRepository: IInvoiceRepository,
    private readonly receiptRepository: IReceiptRepository
  ) {}

  public async issueInvoice(id: string, dto: IssueInvoiceDto): Promise<IInvoice> {
    const errors = validateIssueInvoice(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    // Document numbers must be unique within the restaurant.
    const existing = await this.invoiceRepository.findByDocumentNumber(dto.restaurantId, dto.documentNumber);
    if (existing) {
      throw new ConflictException(`Invoice document number ${dto.documentNumber} already exists`);
    }

    const invoice: IInvoice = {
      id,
      restaurantId: dto.restaurantId,
      orderId: dto.orderId,
      paymentId: dto.paymentId,
      documentNumber: new DocumentNumber(dto.documentNumber),
      customerSnapshot: new CustomerSnapshot(
        dto.customerSnapshot.customerId,
        dto.customerSnapshot.name,
        dto.customerSnapshot.email,
        dto.customerSnapshot.phone,
        dto.customerSnapshot.taxId
      ),
      taxSummary: new TaxSummary(dto.taxSummary.breakdown, dto.taxSummary.totalTaxAmount),
      subtotal: dto.subtotal,
      discountTotal: dto.discountTotal,
      taxTotal: dto.taxTotal,
      grandTotal: dto.grandTotal,
      currency: dto.currency,
      status: new DocumentStatus('Issued'),
      issuedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.invoiceRepository.save(invoice);
    new InvoiceIssuedEvent(invoice.id, invoice.orderId);
    return invoice;
  }

  public async cancelInvoice(id: string): Promise<IInvoice> {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) throw new NotFoundException('Invoice not found');

    if (!invoice.status.canTransitionTo('Cancelled')) {
      throw new ConflictException(`Cannot cancel invoice from status: ${invoice.status.value}`);
    }

    invoice.status = new DocumentStatus('Cancelled');
    invoice.cancelledAt = new Date();
    invoice.updatedAt = new Date();

    await this.invoiceRepository.save(invoice);
    new InvoiceCancelledEvent(invoice.id, invoice.orderId);

    return invoice;
  }

  public async issueReceipt(id: string, dto: IssueReceiptDto): Promise<IReceipt> {
    const errors = validateIssueReceipt(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    // Document numbers must be unique within the restaurant.
    const existing = await this.receiptRepository.findByDocumentNumber(dto.restaurantId, dto.documentNumber);
    if (existing) {
      throw new ConflictException(`Receipt document number ${dto.documentNumber} already exists`);
    }

    const receipt: IReceipt = {
      id,
      restaurantId: dto.restaurantId,
      paymentId: dto.paymentId,
      documentNumber: new DocumentNumber(dto.documentNumber),
      paymentReference: dto.paymentReference,
      amount: dto.amount,
      currency: dto.currency,
      status: new DocumentStatus('Issued'),
      issuedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.receiptRepository.save(receipt);
    new ReceiptIssuedEvent(receipt.id, receipt.paymentId);
    return receipt;
  }

  public async voidReceipt(id: string): Promise<IReceipt> {
    const receipt = await this.receiptRepository.findById(id);
    if (!receipt) throw new NotFoundException('Receipt not found');

    if (!receipt.status.canTransitionTo('Voided')) {
      throw new ConflictException(`Cannot void receipt from status: ${receipt.status.value}`);
    }

    receipt.status = new DocumentStatus('Voided');
    receipt.voidedAt = new Date();
    receipt.updatedAt = new Date();

    await this.receiptRepository.save(receipt);
    new ReceiptVoidedEvent(receipt.id, receipt.paymentId);

    return receipt;
  }
}
