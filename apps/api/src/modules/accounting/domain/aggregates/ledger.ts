import { AggregateRoot } from '@saas/domain';
import { 
  LedgerId, 
  LedgerCode, 
  LedgerName, 
  LedgerType, 
  LedgerStatus, 
  LedgerStatusEnum,
  BaseCurrency,
  FiscalYear,
  OpeningBalance,
  ClosingBalance
} from '../value-objects/ledger-core';
import { LedgerSection } from '../entities/ledger-section';
import { LedgerConfiguration } from '../entities/ledger-configuration';
import { LedgerHistoryEntry } from '../entities/ledger-history-entry';
import {
  LedgerCreated,
  LedgerOpened,
  LedgerClosed,
  LedgerArchived,
  LedgerConfigurationChanged
} from '../events/ledger-events';

export class Ledger extends AggregateRoot<LedgerId> {
  private _status: LedgerStatus;
  private _sections: LedgerSection[] = [];
  private _history: LedgerHistoryEntry[] = [];
  private _journalReferences: string[] = []; // In a real system, might be a JournalEntry aggregate relationship
  private _configuration: LedgerConfiguration;
  private _closingBalance: ClosingBalance | null = null;

  constructor(
    id: LedgerId,
    public readonly code: LedgerCode,
    public readonly name: LedgerName,
    public readonly type: LedgerType,
    public readonly baseCurrency: BaseCurrency,
    public readonly fiscalYear: FiscalYear,
    public readonly openingBalance: OpeningBalance,
    status: LedgerStatus = LedgerStatus.create(LedgerStatusEnum.DRAFT),
    configuration: LedgerConfiguration = LedgerConfiguration.create(false, true, false)
  ) {
    super(id);
    this._status = status;
    this._configuration = configuration;
  }

  public static create(
    code: LedgerCode,
    name: LedgerName,
    type: LedgerType,
    baseCurrency: BaseCurrency,
    fiscalYear: FiscalYear,
    openingBalance: OpeningBalance
  ): Ledger {
    const id = LedgerId.generate();
    const ledger = new Ledger(id, code, name, type, baseCurrency, fiscalYear, openingBalance);

    ledger.record(new LedgerCreated(id.toValue(), ledger.version(), {
      ledgerId: id.toValue(),
      ledgerCode: code.toValue(),
      currency: baseCurrency.toValue()
    }));

    return ledger;
  }

  get status(): LedgerStatus { return this._status; }
  get configuration(): LedgerConfiguration { return this._configuration; }
  get sections(): LedgerSection[] { return [...this._sections]; }
  get history(): LedgerHistoryEntry[] { return [...this._history]; }
  get closingBalance(): ClosingBalance | null { return this._closingBalance; }
  get journalReferences(): string[] { return [...this._journalReferences]; }

  private checkImmutability(): void {
    if (this._status.toValue() === LedgerStatusEnum.CLOSED || this._status.toValue() === LedgerStatusEnum.ARCHIVED) {
      throw new Error(`Ledger is strictly immutable in state: ${this._status.toValue()}`);
    }
  }

  public open(performedBy: string): void {
    if (this._status.toValue() !== LedgerStatusEnum.DRAFT) {
      throw new Error('Can only open DRAFT ledgers.');
    }

    this._status = LedgerStatus.create(LedgerStatusEnum.OPEN);
    this._history.push(LedgerHistoryEntry.create('OPENED', performedBy));

    this.record(new LedgerOpened(this.id.toValue(), this.version(), {
      ledgerId: this.id.toValue(),
      fiscalYear: this.fiscalYear.year
    }));
  }

  public close(closingBalance: ClosingBalance, performedBy: string): void {
    if (this._status.toValue() !== LedgerStatusEnum.OPEN) {
      throw new Error('Only OPEN ledgers can be closed.');
    }

    this._status = LedgerStatus.create(LedgerStatusEnum.CLOSED);
    this._closingBalance = closingBalance;
    this._history.push(LedgerHistoryEntry.create('CLOSED', performedBy));

    this.record(new LedgerClosed(this.id.toValue(), this.version(), {
      ledgerId: this.id.toValue(),
      closingBalance: closingBalance.toValue()
    }));
  }

  public archive(performedBy: string): void {
    if (this._status.toValue() === LedgerStatusEnum.ARCHIVED) return;
    if (this._status.toValue() !== LedgerStatusEnum.CLOSED) {
      throw new Error('Only CLOSED ledgers can be archived.');
    }

    this._status = LedgerStatus.create(LedgerStatusEnum.ARCHIVED);
    this._history.push(LedgerHistoryEntry.create('ARCHIVED', performedBy));

    this.record(new LedgerArchived(this.id.toValue(), this.version(), {
      ledgerId: this.id.toValue()
    }));
  }

  public changeConfiguration(newConfig: LedgerConfiguration, performedBy: string): void {
    this.checkImmutability();
    this._configuration = newConfig;
    this._history.push(LedgerHistoryEntry.create('CONFIG_CHANGED', performedBy));

    this.record(new LedgerConfigurationChanged(this.id.toValue(), this.version(), {
      ledgerId: this.id.toValue()
    }));
  }

  public registerJournalReference(journalId: string): void {
    this.checkImmutability();
    if (this._status.toValue() !== LedgerStatusEnum.OPEN) {
      throw new Error('Journals can only be referenced in OPEN ledgers.');
    }
    this._journalReferences.push(journalId);
  }
}
