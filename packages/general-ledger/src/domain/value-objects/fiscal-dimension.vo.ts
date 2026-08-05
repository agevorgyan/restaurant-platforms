export class FiscalDimension {
  private constructor(
    private readonly fiscalYear: number,
    private readonly fiscalPeriod: number,
    private readonly isClosed: boolean
  ) {}

  public static create(fiscalYear: number, fiscalPeriod: number, isClosed: boolean = false): FiscalDimension {
    if (fiscalYear < 2000 || fiscalYear > 2100) {
      throw new Error(`Invalid fiscalYear: ${fiscalYear}`);
    }
    if (fiscalPeriod < 1 || fiscalPeriod > 13) {
      throw new Error(`Invalid fiscalPeriod: ${fiscalPeriod}. Must be between 1 and 13.`);
    }
    return new FiscalDimension(fiscalYear, fiscalPeriod, isClosed);
  }

  public getFiscalYear(): number {
    return this.fiscalYear;
  }

  public getFiscalPeriod(): number {
    return this.fiscalPeriod;
  }

  public getIsClosed(): boolean {
    return this.isClosed;
  }

  public equals(other: FiscalDimension): boolean {
    return (
      this.fiscalYear === other.getFiscalYear() &&
      this.fiscalPeriod === other.getFiscalPeriod() &&
      this.isClosed === other.getIsClosed()
    );
  }
}
