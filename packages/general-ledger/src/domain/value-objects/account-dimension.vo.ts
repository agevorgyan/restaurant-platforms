export type DimensionType = 'COST_CENTER' | 'LOCATION' | 'CHANNEL' | 'PROJECT' | 'CUSTOM';

export class AccountDimension {
  private constructor(
    private readonly dimensionKey: string,
    private readonly dimensionType: DimensionType,
    private readonly isMandatory: boolean
  ) {}

  public static create(
    dimensionKey: string,
    dimensionType: DimensionType = 'CUSTOM',
    isMandatory: boolean = false
  ): AccountDimension {
    if (!dimensionKey || dimensionKey.trim().length === 0) {
      throw new Error('DimensionKey cannot be empty');
    }
    return new AccountDimension(dimensionKey.trim().toUpperCase(), dimensionType, isMandatory);
  }

  public getDimensionKey(): string {
    return this.dimensionKey;
  }

  public getDimensionType(): DimensionType {
    return this.dimensionType;
  }

  public getIsMandatory(): boolean {
    return this.isMandatory;
  }

  public equals(other: AccountDimension): boolean {
    return this.dimensionKey === other.getDimensionKey();
  }
}
