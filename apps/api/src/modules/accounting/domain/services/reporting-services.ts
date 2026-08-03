import { IDomainService } from '@saas/domain';
import { FinancialStatement, StatementSection, StatementTotals } from '../../application/read-models/financial-statement.model';

export class BalanceSheetGenerator implements IDomainService {
  public generate(periodId: string, companyName: string, currency: string, rawData: any): FinancialStatement {
    // In a real application, rawData would be typed (e.g., account balances aggregated by repository)
    // This generator orchestrates the mapping of raw ledger balances into the Read Model.
    
    const assetsSection = new StatementSection('Assets', [], [], 0);
    const liabilitiesSection = new StatementSection('Liabilities', [], [], 0);
    const equitySection = new StatementSection('Equity', [], [], 0);
    
    return new FinancialStatement(
      crypto.randomUUID(),
      'BALANCE_SHEET',
      companyName,
      periodId,
      new Date(),
      currency,
      [assetsSection, liabilitiesSection, equitySection],
      new StatementTotals(0, 0, 0)
    );
  }
}

export class IncomeStatementGenerator implements IDomainService {
  public generate(periodId: string, companyName: string, currency: string, rawData: any): FinancialStatement {
    const revenueSection = new StatementSection('Revenue', [], [], 0);
    const expenseSection = new StatementSection('Expenses', [], [], 0);
    
    return new FinancialStatement(
      crypto.randomUUID(),
      'INCOME_STATEMENT',
      companyName,
      periodId,
      new Date(),
      currency,
      [revenueSection, expenseSection],
      new StatementTotals(null, null, null, 0, 0, 0)
    );
  }
}

export class CashFlowGenerator implements IDomainService {
  public generate(periodId: string, companyName: string, currency: string, rawData: any): FinancialStatement {
    const operatingSection = new StatementSection('Operating Activities', [], [], 0);
    const investingSection = new StatementSection('Investing Activities', [], [], 0);
    const financingSection = new StatementSection('Financing Activities', [], [], 0);
    
    return new FinancialStatement(
      crypto.randomUUID(),
      'CASH_FLOW',
      companyName,
      periodId,
      new Date(),
      currency,
      [operatingSection, investingSection, financingSection],
      new StatementTotals()
    );
  }
}

export class TrialBalanceGenerator implements IDomainService {
  public generate(periodId: string, companyName: string, currency: string, rawData: any): FinancialStatement {
    const balancesSection = new StatementSection('Account Balances', [], [], 0);
    
    return new FinancialStatement(
      crypto.randomUUID(),
      'TRIAL_BALANCE',
      companyName,
      periodId,
      new Date(),
      currency,
      [balancesSection],
      new StatementTotals()
    );
  }
}

export class LedgerReportGenerator implements IDomainService {
  public generate(periodId: string, accountId: string, companyName: string, currency: string, rawData: any): FinancialStatement {
    const ledgerSection = new StatementSection(`Ledger - ${accountId}`, [], [], 0);
    
    return new FinancialStatement(
      crypto.randomUUID(),
      'GENERAL_LEDGER',
      companyName,
      periodId,
      new Date(),
      currency,
      [ledgerSection],
      new StatementTotals()
    );
  }
}

export class AgingReportGenerator implements IDomainService {
  public generateReceivablesAging(currentDate: Date, companyName: string, currency: string, rawData: any): FinancialStatement {
    const agingSection = new StatementSection('Accounts Receivable Aging', [], [], 0);
    
    return new FinancialStatement(
      crypto.randomUUID(),
      'AR_AGING',
      companyName,
      'As of ' + currentDate.toISOString().split('T')[0],
      new Date(),
      currency,
      [agingSection],
      new StatementTotals()
    );
  }

  public generatePayablesAging(currentDate: Date, companyName: string, currency: string, rawData: any): FinancialStatement {
    const agingSection = new StatementSection('Accounts Payable Aging', [], [], 0);
    
    return new FinancialStatement(
      crypto.randomUUID(),
      'AP_AGING',
      companyName,
      'As of ' + currentDate.toISOString().split('T')[0],
      new Date(),
      currency,
      [agingSection],
      new StatementTotals()
    );
  }
}
