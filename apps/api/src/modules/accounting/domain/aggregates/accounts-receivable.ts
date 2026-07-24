import { AggregateRoot } from '@saas/domain';
import {
  ReceivableId,
  ReceivableNumber,
  CustomerReference,
  InvoiceReference,
  ReceivableStatus,
  ReceivableStatusEnum,
  DueDate,
  IssueDate,
  OutstandingAmount,
  OriginalAmount,
  CreditTerms
} from '../value-objects/accounts-receivable-core';
import { ReceivableLine } from '../entities/receivable-line';
import { PaymentAllocation } from '../entities/payment-allocation';
import { WriteOffRecord } from '../entities/write-off-record';
import { CollectionAttempt } from '../entities/collection-attempt';
import { ReceivableHistoryEntry } from '../entities/receivable-history-entry';
import {
  ReceivableCreated,
  InvoiceIssued,
  PaymentAllocated,
  PartialPaymentRecorded,
  ReceivableClosed,
  ReceivableWrittenOff,
  ReceivableReopened
} from '../events/accounts-receivable-events';
import {
  OutstandingBalanceSpecification,
  AllocationSpecification,
  WriteOffApprovalSpecification
} from '../rules/accounting-rules';
import { PaymentAllocationService, ReceivableBalanceService } from '../services/accounting-services';

export class AccountsReceivable extends AggregateRoot<ReceivableId> {
  private _status: ReceivableStatus;
  private _outstandingAmount: OutstandingAmount;
  
  private _lines: ReceivableLine[] = [];
  private _allocations: PaymentAllocation[] = [];
  private _writeOffs: WriteOffRecord[] = [];
  private _collectionAttempts: CollectionAttempt[] = [];
  private _history: ReceivableHistoryEntry[] = [];

  constructor(
    id: ReceivableId,
    public readonly number: ReceivableNumber,
    public readonly customerReference: CustomerReference,
    public readonly originalAmount: OriginalAmount,
    public readonly issueDate: IssueDate,
    public readonly dueDate: DueDate,
    public readonly creditTerms: CreditTerms,
    status: ReceivableStatus = ReceivableStatus.create(ReceivableStatusEnum.DRAFT),
    outstandingAmount: OutstandingAmount = OutstandingAmount.create(originalAmount.toValue())
  ) {
    super(id);
    this._status = status;
    this._outstandingAmount = outstandingAmount;
  }

  public static create(
    number: ReceivableNumber,
    customerReference: CustomerReference,
    originalAmount: OriginalAmount,
    issueDate: IssueDate,
    dueDate: DueDate,
    creditTerms: CreditTerms
  ): AccountsReceivable {
    const id = ReceivableId.generate();
    const receivable = new AccountsReceivable(
      id,
      number,
      customerReference,
      originalAmount,
      issueDate,
      dueDate,
      creditTerms
    );

    receivable.record(new ReceivableCreated(id.toValue(), receivable.version(), {
      receivableId: id.toValue(),
      customerReference: customerReference.toValue(),
      originalAmount: originalAmount.toValue()
    }));

    return receivable;
  }

  get status(): ReceivableStatus { return this._status; }
  get outstandingAmount(): OutstandingAmount { return this._outstandingAmount; }
  get allocations(): PaymentAllocation[] { return [...this._allocations]; }

  public issueInvoice(invoiceReference: InvoiceReference): void {
    if (this._status.toValue() !== ReceivableStatusEnum.DRAFT) {
      throw new Error('Only DRAFT receivables can be issued.');
    }
    
    this._status = ReceivableStatus.create(ReceivableStatusEnum.ISSUED);
    
    this.record(new InvoiceIssued(this.id.toValue(), this.version(), {
      receivableId: this.id.toValue(),
      invoiceReference: invoiceReference.toValue()
    }));
  }

  public allocatePayment(
    paymentReference: string,
    amount: number,
    allocationService: PaymentAllocationService,
    balanceService: ReceivableBalanceService
  ): void {
    const allocSpec = new AllocationSpecification();
    if (!allocSpec.isSatisfiedBy({ status: this._status.toValue() })) {
      throw new Error('Cannot allocate payment to CLOSED or WRITTEN_OFF receivable.');
    }

    if (!allocationService.canAllocate(this._outstandingAmount.toValue(), amount)) {
      throw new Error('Invalid allocation amount. It exceeds outstanding balance or is negative.');
    }

    const allocation = PaymentAllocation.create(paymentReference, amount);
    this._allocations.push(allocation);

    const newBalance = balanceService.calculateOutstanding(
      this.originalAmount.toValue(),
      this._allocations.map(a => a.allocatedAmount),
      this._writeOffs.map(w => w.amount)
    );

    this._outstandingAmount = OutstandingAmount.create(newBalance);

    if (newBalance === 0) {
      this._status = ReceivableStatus.create(ReceivableStatusEnum.CLOSED);
      this.record(new PaymentAllocated(this.id.toValue(), this.version(), {
        receivableId: this.id.toValue(),
        paymentReference,
        amount,
        outstandingBalance: 0
      }));
      this.record(new ReceivableClosed(this.id.toValue(), this.version(), {
        receivableId: this.id.toValue()
      }));
    } else {
      this._status = ReceivableStatus.create(ReceivableStatusEnum.PARTIALLY_PAID);
      this.record(new PartialPaymentRecorded(this.id.toValue(), this.version(), {
        receivableId: this.id.toValue(),
        amount
      }));
    }
  }

  public writeOff(amount: number, reason: string, approverId: string, balanceService: ReceivableBalanceService): void {
    const allocSpec = new AllocationSpecification();
    if (!allocSpec.isSatisfiedBy({ status: this._status.toValue() })) {
      throw new Error('Cannot write off CLOSED or already WRITTEN_OFF receivable.');
    }

    const approvalSpec = new WriteOffApprovalSpecification();
    if (!approvalSpec.isSatisfiedBy({ approverId })) {
      throw new Error('Write off requires an approver.');
    }

    const outSpec = new OutstandingBalanceSpecification();
    if (!outSpec.isSatisfiedBy({ outstandingAmount: this._outstandingAmount.toValue(), allocationAmount: amount })) {
      throw new Error('Write off amount cannot exceed outstanding balance.');
    }

    const record = WriteOffRecord.create(amount, reason, approverId);
    this._writeOffs.push(record);

    const newBalance = balanceService.calculateOutstanding(
      this.originalAmount.toValue(),
      this._allocations.map(a => a.allocatedAmount),
      this._writeOffs.map(w => w.amount)
    );

    this._outstandingAmount = OutstandingAmount.create(newBalance);

    if (newBalance === 0) {
      this._status = ReceivableStatus.create(ReceivableStatusEnum.WRITTEN_OFF);
    }

    this.record(new ReceivableWrittenOff(this.id.toValue(), this.version(), {
      receivableId: this.id.toValue(),
      amount,
      approverId
    }));
  }

  public reopen(reason: string): void {
    if (this._status.toValue() !== ReceivableStatusEnum.CLOSED && this._status.toValue() !== ReceivableStatusEnum.WRITTEN_OFF) {
      throw new Error('Only CLOSED or WRITTEN_OFF receivables can be reopened.');
    }

    if (this._outstandingAmount.toValue() === 0 && this._writeOffs.length === 0) {
        // Technically if it's perfectly paid, reopening might require reversing a payment, 
        // but domain logic dictates status shifts back to PARTIALLY_PAID or ISSUED depending on outstanding
    }
    
    // For simplicity, shift to partially paid if > 0 otherwise ISSUED
    this._status = this._outstandingAmount.toValue() > 0 && this._outstandingAmount.toValue() < this.originalAmount.toValue()
      ? ReceivableStatus.create(ReceivableStatusEnum.PARTIALLY_PAID)
      : ReceivableStatus.create(ReceivableStatusEnum.ISSUED);

    this.record(new ReceivableReopened(this.id.toValue(), this.version(), {
      receivableId: this.id.toValue(),
      reason
    }));
  }
}
