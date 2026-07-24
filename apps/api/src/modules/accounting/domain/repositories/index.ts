import { IRepository } from '@saas/domain';
import { Ledger } from '../aggregates/ledger';

export interface ILedgerRepository extends IRepository<Ledger> {
  findByCode(code: string): Promise<Ledger | null>;
  findActiveLedger(fiscalYear: number): Promise<Ledger | null>;
}
