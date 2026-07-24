import { AggregateRoot } from '@saas/domain';
import {
  JournalEntryId,
  JournalNumber,
  JournalType,
  PostingDate,
  AccountingDate,
  ReferenceNumber,
  JournalStatus,
  JournalStatusEnum,
  PostingPeriod,
  Currency,
  ExchangeRate,
  Memo
} from '../value-objects/journal-entry-core';
import { DebitEntry, CreditEntry } from '../entities/journal-line';
import { AttachmentReference } from '../entities/attachment-reference';
import { JournalApprovalRecord } from '../entities/journal-approval-record';
import {
  JournalCreated,
  JournalApproved,
  JournalPosted,
  JournalReversed,
  JournalVoided
} from '../events/journal-events';
import { BalancedJournalSpecification } from '../rules/accounting-rules';
import { DoubleEntryValidationService, JournalBalancingService } from '../services/accounting-services';

export class JournalEntry extends AggregateRoot<JournalEntryId> {
  private _status: JournalStatus;
  private _debitLines: DebitEntry[] = [];
  private _creditLines: CreditEntry[] = [];
  private _attachments: AttachmentReference[] = [];
  private _approvalRecords: JournalApprovalRecord[] = [];
  private _postingDate: PostingDate | null = null;
  private _exchangeRate: ExchangeRate | null = null;

  constructor(
    id: JournalEntryId,
    public readonly journalNumber: JournalNumber,
    public readonly type: JournalType,
    public readonly accountingDate: AccountingDate,
    public readonly referenceNumber: ReferenceNumber,
    public readonly postingPeriod: PostingPeriod,
    public readonly currency: Currency,
    public readonly memo: Memo,
    status: JournalStatus = JournalStatus.create(JournalStatusEnum.DRAFT)
  ) {
    super(id);
    this._status = status;
  }

  public static create(
    journalNumber: JournalNumber,
    type: JournalType,
    accountingDate: AccountingDate,
    referenceNumber: ReferenceNumber,
    postingPeriod: PostingPeriod,
    currency: Currency,
    memo: Memo
  ): JournalEntry {
    const id = JournalEntryId.generate();
    const entry = new JournalEntry(id, journalNumber, type, accountingDate, referenceNumber, postingPeriod, currency, memo);

    entry.record(new JournalCreated(id.toValue(), entry.version(), {
      journalId: id.toValue(),
      journalNumber: journalNumber.toValue(),
      currency: currency.toValue()
    }));

    return entry;
  }

  get status(): JournalStatus { return this._status; }
  get debitLines(): DebitEntry[] { return [...this._debitLines]; }
  get creditLines(): CreditEntry[] { return [...this._creditLines]; }
  get postingDate(): PostingDate | null { return this._postingDate; }
  get exchangeRate(): ExchangeRate | null { return this._exchangeRate; }

  private checkImmutability(): void {
    const s = this._status.toValue();
    if (s === JournalStatusEnum.POSTED || s === JournalStatusEnum.REVERSED || s === JournalStatusEnum.VOIDED) {
      throw new Error(`Journal Entry is strictly immutable in state: ${s}`);
    }
  }

  public setExchangeRate(rate: ExchangeRate): void {
    this.checkImmutability();
    this._exchangeRate = rate;
  }

  public addDebitLine(line: DebitEntry): void {
    this.checkImmutability();
    this._debitLines.push(line);
  }

  public addCreditLine(line: CreditEntry): void {
    this.checkImmutability();
    this._creditLines.push(line);
  }

  public validate(validationService: DoubleEntryValidationService, balancingService: JournalBalancingService): void {
    if (!validationService.validateLines([...this._debitLines, ...this._creditLines])) {
      throw new Error('Journal must contain at least two lines.');
    }

    const { totalDebit, totalCredit } = balancingService.calculateTotals(
      this._debitLines.map(l => l.amount), 
      this._creditLines.map(l => l.amount)
    );

    const isBalanced = new BalancedJournalSpecification().isSatisfiedBy({ totalDebit, totalCredit });
    if (!isBalanced) {
      throw new Error('Journal is not balanced. Total Debits must equal Total Credits.');
    }

    if (this._status.toValue() === JournalStatusEnum.DRAFT) {
      this._status = JournalStatus.create(JournalStatusEnum.PENDING_APPROVAL);
    }
  }

  public approve(approverId: string, role: string, comments: string = ''): void {
    if (this._status.toValue() !== JournalStatusEnum.PENDING_APPROVAL) {
      throw new Error('Only journals pending approval can be approved.');
    }

    this._approvalRecords.push(JournalApprovalRecord.create(approverId, role, comments));
    this._status = JournalStatus.create(JournalStatusEnum.APPROVED);

    this.record(new JournalApproved(this.id.toValue(), this.version(), {
      journalId: this.id.toValue(),
      approverId
    }));
  }

  public post(postingDate: PostingDate, isPostingPeriodOpen: boolean): void {
    if (this._status.toValue() !== JournalStatusEnum.APPROVED) {
      throw new Error('Only approved journals can be posted.');
    }
    if (!isPostingPeriodOpen) {
      throw new Error('Posting period must be open.');
    }

    this._postingDate = postingDate;
    this._status = JournalStatus.create(JournalStatusEnum.POSTED);

    this.record(new JournalPosted(this.id.toValue(), this.version(), {
      journalId: this.id.toValue(),
      postingDate: postingDate.toValue()
    }));
  }

  public reverse(reversedBy: string): void {
    if (this._status.toValue() !== JournalStatusEnum.POSTED) {
      throw new Error('Only POSTED journals can be reversed.');
    }

    this._status = JournalStatus.create(JournalStatusEnum.REVERSED);

    this.record(new JournalReversed(this.id.toValue(), this.version(), {
      journalId: this.id.toValue(),
      reversedBy
    }));
  }

  public voidDraft(): void {
    if (this._status.toValue() === JournalStatusEnum.POSTED) {
      throw new Error('POSTED journals cannot be voided, they must be reversed.');
    }

    this._status = JournalStatus.create(JournalStatusEnum.VOIDED);

    this.record(new JournalVoided(this.id.toValue(), this.version(), {
      journalId: this.id.toValue()
    }));
  }
}
