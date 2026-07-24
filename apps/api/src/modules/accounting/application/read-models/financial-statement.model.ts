export class StatementLine {
  constructor(
    public readonly name: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly isDebit: boolean,
    public readonly isCredit: boolean,
    public readonly referenceIds: string[] = [] // E.g. account IDs contributing to this line
  ) {}
}

export class StatementTotals {
  constructor(
    public readonly totalAssets: number | null = null,
    public readonly totalLiabilities: number | null = null,
    public readonly totalEquity: number | null = null,
    public readonly netIncome: number | null = null,
    public readonly totalRevenue: number | null = null,
    public readonly totalExpenses: number | null = null,
    public readonly customTotals: Record<string, number> = {}
  ) {}
}

export class StatementSection {
  constructor(
    public readonly title: string,
    public readonly lines: StatementLine[],
    public readonly subSections: StatementSection[] = [],
    public readonly sectionTotal: number
  ) {}
}

export class FinancialStatement {
  constructor(
    public readonly reportId: string,
    public readonly reportType: string,
    public readonly companyName: string,
    public readonly periodName: string,
    public readonly generatedAt: Date,
    public readonly currency: string,
    public readonly sections: StatementSection[],
    public readonly totals: StatementTotals
  ) {}
}
