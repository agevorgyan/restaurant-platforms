export class AccountName {
  private constructor(private readonly value: string) {}

  public static create(name: string): AccountName {
    if (!name || name.trim().length === 0) {
      throw new Error('AccountName cannot be empty');
    }
    const cleanName = name.trim();
    if (cleanName.length > 100) {
      throw new Error('AccountName cannot exceed 100 characters');
    }
    return new AccountName(cleanName);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: AccountName): boolean {
    return this.value.toLowerCase() === other.getValue().toLowerCase();
  }
}
