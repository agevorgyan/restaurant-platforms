export type ReportingStandard = 'GAAP' | 'IFRS' | 'MANAGEMENT';

export class AccountClassification {
  private constructor(
    private readonly standard: ReportingStandard,
    private readonly classificationCode: string,
    private readonly lineItemName: string
  ) {}

  public static create(
    standard: ReportingStandard,
    classificationCode: string,
    lineItemName: string
  ): AccountClassification {
    if (!classificationCode || classificationCode.trim().length === 0) {
      throw new Error('Classification code cannot be empty');
    }
    if (!lineItemName || lineItemName.trim().length === 0) {
      throw new Error('Line item name cannot be empty');
    }
    return new AccountClassification(standard, classificationCode.trim(), lineItemName.trim());
  }

  public getStandard(): ReportingStandard {
    return this.standard;
  }

  public getClassificationCode(): string {
    return this.classificationCode;
  }

  public getLineItemName(): string {
    return this.lineItemName;
  }

  public equals(other: AccountClassification): boolean {
    return (
      this.standard === other.getStandard() &&
      this.classificationCode === other.getClassificationCode()
    );
  }
}
