import { IRepository } from '@saas/domain';
import { Ledger } from '../aggregates/ledger';
import { JournalEntry } from '../aggregates/journal-entry';

export interface ILedgerRepository extends IRepository<Ledger> {
  findByCode(code: string): Promise<Ledger | null>;
  findActiveLedger(fiscalYear: number): Promise<Ledger | null>;
}

export interface IJournalEntryRepository extends IRepository<JournalEntry> {
  findByReference(referenceNumber: string): Promise<JournalEntry[]>;
  findUnposted(period: string): Promise<JournalEntry[]>;
}
