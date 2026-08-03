import { AggregateRoot } from '@saas/domain';
import {
  PayableId,
  PayableNumber,
  SupplierReference,
  VendorInvoiceNumber,
  PurchaseOrderReference,
  PaymentTerms,
  PayableStatus,
  PayableStatusEnum,
  Priority
} from '../value-objects/accounts-payable-core';
import { Currency } from '../value-objects/journal-entry-core';
import { OriginalAmount, OutstandingAmount, DueDate, IssueDate } from '../value-objects/accounts-receivable-core';
import { PayableLine } from '../entities/payable-line';
import { PaymentAllocation } from '../entities/payment-allocation';
import { CreditNote } from '../entities/credit-note';
import { ApprovalRecord } from '../entities/approval-record';
import { PaymentSchedule } from '../entities/payment-schedule';
import { PayableHistoryEntry } from '../entities/payable-history-entry';
import {
  PayableCreated,
  SupplierInvoiceRegistered,
  PayableApproved,
  PayablePaymentAllocated as PaymentAllocated,
  PayablePartialPaymentRecorded as PartialPaymentRecorded,
  CreditNoteApplied,
  PayableClosed,
  PayableReopened,
  PayableWrittenOff
} from '../events/accounts-payable-events';
import {
  SupplierInvoiceSpecification,
  PaymentTermsSpecification,
  OutstandingBalanceSpecification,
  CreditNoteSpecification,
  ApprovalSpecification,
  WriteOffApprovalSpecification,
  AllocationSpecification
} from '../rules/accounting-rules';
import {
  PaymentAllocationService,
  PayableBalanceService,
  CreditNoteService,
  PaymentScheduleService
} from '../services/accounting-services';

export class AccountsPayable extends AggregateRoot<PayableId> {
  private _status: PayableStatus;
  private _outstandingAmount: OutstandingAmount;
  
  private _lines: PayableLine[] = [];
  private _allocations: PaymentAllocation[] = [];
  private _creditNotes: CreditNote[] = [];
  private _approvals: ApprovalRecord[] = [];
  private _schedules: PaymentSchedule[] = [];
  private _history: PayableHistoryEntry[] = [];
  
  private _vendorInvoiceNumber: VendorInvoiceNumber | null = null;

  constructor(
    id: PayableId,
    public readonly number: PayableNumber,
    public readonly supplierReference: SupplierReference,
    public readonly originalAmount: OriginalAmount,
    public readonly issueDate: IssueDate,
    public readonly dueDate: DueDate,
    public readonly paymentTerms: PaymentTerms,
    public readonly currency: string,
    status: PayableStatus = PayableStatus.create(PayableStatusEnum.DRAFT),
    outstandingAmount: OutstandingAmount = OutstandingAmount.create(originalAmount.toValue())
  ) {
    super(id);
    this._status = status;
    this._outstandingAmount = outstandingAmount;
  }

  public static create(
    number: PayableNumber,
    supplierReference: SupplierReference,
    originalAmount: OriginalAmount,
    issueDate: IssueDate,
    dueDate: DueDate,
    paymentTerms: PaymentTerms,
    currency: string
  ): AccountsPayable {
    const id = PayableId.generate();
    const payable = new AccountsPayable(
      id,
      number,
      supplierReference,
      originalAmount,
      issueDate,
      dueDate,
      paymentTerms,
      currency
    );

    payable.record(new PayableCreated(id.toValue(), payable.version(), {
      payableId: id.toValue(),
      supplierReference: supplierReference.toValue(),
      originalAmount: originalAmount.toValue()
    }));

    return payable;
  }

  get status(): PayableStatus { return this._status; }
  get outstandingAmount(): OutstandingAmount { return this._outstandingAmount; }

  public registerSupplierInvoice(vendorInvoiceNumber: VendorInvoiceNumber): void {
    const invoiceSpec = new SupplierInvoiceSpecification();
    if (!invoiceSpec.isSatisfiedBy({ invoiceNumber: vendorInvoiceNumber.toValue() })) {
      throw new Error('Invalid vendor invoice number.');
    }

    if (this._status.toValue() !== PayableStatusEnum.DRAFT) {
      throw new Error('Can only register invoices on DRAFT payables.');
    }

    this._vendorInvoiceNumber = vendorInvoiceNumber;
    this._status = PayableStatus.create(PayableStatusEnum.REGISTERED);

    this.record(new SupplierInvoiceRegistered(this.id.toValue(), this.version(), {
      payableId: this.id.toValue(),
      vendorInvoiceNumber: vendorInvoiceNumber.toValue()
    }));
  }

  public approve(approverId: string): void {
    const approvalSpec = new ApprovalSpecification();
    if (!approvalSpec.isSatisfiedBy({ status: this._status.toValue() })) {
      throw new Error('Only REGISTERED payables can be approved.');
    }

    const record = ApprovalRecord.create(approverId, true, 'Approved for payment allocation');
    this._approvals.push(record);
    this._status = PayableStatus.create(PayableStatusEnum.APPROVED);

    this.record(new PayableApproved(this.id.toValue(), this.version(), {
      payableId: this.id.toValue(),
      approverId
    }));
  }

  public allocatePayment(
    paymentReference: string,
    amount: number,
    allocationService: PaymentAllocationService,
    balanceService: PayableBalanceService
  ): void {
    if (this._status.toValue() !== PayableStatusEnum.APPROVED && this._status.toValue() !== PayableStatusEnum.PARTIALLY_PAID) {
      throw new Error('Cannot allocate payments unless payable is APPROVED or PARTIALLY_PAID.');
    }

    if (!allocationService.canAllocate(this._outstandingAmount.toValue(), amount)) {
      throw new Error('Invalid allocation amount. Exceeds outstanding balance or is negative.');
    }

    const allocation = PaymentAllocation.create(paymentReference, amount);
    this._allocations.push(allocation);

    const newBalance = balanceService.calculateOutstanding(
      this.originalAmount.toValue(),
      this._allocations.map(a => a.allocatedAmount),
      this._creditNotes.map(c => c.amount),
      [] // writeoffs handle closing directly typically, but for balance accuracy
    );

    this._outstandingAmount = OutstandingAmount.create(newBalance);

    if (newBalance === 0) {
      this._status = PayableStatus.create(PayableStatusEnum.CLOSED);
      this.record(new PaymentAllocated(this.id.toValue(), this.version(), {
        payableId: this.id.toValue(),
        paymentReference,
        amount,
        outstandingBalance: 0
      }));
      this.record(new PayableClosed(this.id.toValue(), this.version(), {
        payableId: this.id.toValue()
      }));
    } else {
      this._status = PayableStatus.create(PayableStatusEnum.PARTIALLY_PAID);
      this.record(new PartialPaymentRecorded(this.id.toValue(), this.version(), {
        payableId: this.id.toValue(),
        amount
      }));
    }
  }

  public applyCreditNote(
    creditNoteReference: string,
    amount: number,
    reason: string,
    creditNoteService: CreditNoteService,
    balanceService: PayableBalanceService
  ): void {
    const allocSpec = new AllocationSpecification();
    if (!allocSpec.isSatisfiedBy({ status: this._status.toValue() })) {
      throw new Error('Cannot apply credit notes to CLOSED or WRITTEN_OFF payables.');
    }

    if (!creditNoteService.canApply(this._outstandingAmount.toValue(), amount)) {
      throw new Error('Credit note amount cannot exceed outstanding balance.');
    }

    const creditNote = CreditNote.create(creditNoteReference, amount, reason);
    this._creditNotes.push(creditNote);

    const newBalance = balanceService.calculateOutstanding(
      this.originalAmount.toValue(),
      this._allocations.map(a => a.allocatedAmount),
      this._creditNotes.map(c => c.amount),
      []
    );

    this._outstandingAmount = OutstandingAmount.create(newBalance);

    this.record(new CreditNoteApplied(this.id.toValue(), this.version(), {
      payableId: this.id.toValue(),
      creditNoteReference,
      amount
    }));

    if (newBalance === 0) {
      this._status = PayableStatus.create(PayableStatusEnum.CLOSED);
      this.record(new PayableClosed(this.id.toValue(), this.version(), {
        payableId: this.id.toValue()
      }));
    }
  }

  public writeOff(amount: number, reason: string, approverId: string, balanceService: PayableBalanceService): void {
    const allocSpec = new AllocationSpecification();
    if (!allocSpec.isSatisfiedBy({ status: this._status.toValue() })) {
      throw new Error('Cannot write off CLOSED or already WRITTEN_OFF payables.');
    }

    const approvalSpec = new WriteOffApprovalSpecification();
    if (!approvalSpec.isSatisfiedBy({ approverId })) {
      throw new Error('Write off requires an approver.');
    }

    const outSpec = new OutstandingBalanceSpecification();
    if (!outSpec.isSatisfiedBy({ outstandingAmount: this._outstandingAmount.toValue(), allocationAmount: amount })) {
      throw new Error('Write off amount cannot exceed outstanding balance.');
    }

    // In a full implementation, we'd add the write-off to an internal list, but we can just use zeroing here.
    // Assuming a write-off simply zeroes the balance for demo purposes.
    const newBalance = 0;
    
    this._outstandingAmount = OutstandingAmount.create(newBalance);
    this._status = PayableStatus.create(PayableStatusEnum.WRITTEN_OFF);

    this.record(new PayableWrittenOff(this.id.toValue(), this.version(), {
      payableId: this.id.toValue(),
      amount,
      approverId
    }));
  }

  public reopen(reason: string): void {
    if (this._status.toValue() !== PayableStatusEnum.CLOSED && this._status.toValue() !== PayableStatusEnum.WRITTEN_OFF) {
      throw new Error('Only CLOSED or WRITTEN_OFF payables can be reopened.');
    }
    
    this._status = this._outstandingAmount.toValue() > 0 && this._outstandingAmount.toValue() < this.originalAmount.toValue()
      ? PayableStatus.create(PayableStatusEnum.PARTIALLY_PAID)
      : PayableStatus.create(PayableStatusEnum.APPROVED);

    this.record(new PayableReopened(this.id.toValue(), this.version(), {
      payableId: this.id.toValue(),
      reason
    }));
  }
}
