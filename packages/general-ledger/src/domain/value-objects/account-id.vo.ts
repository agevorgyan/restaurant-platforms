export class AccountId {
  private constructor(private readonly value: string) {}

  public static create(id: string): AccountId {
    if (!id || id.trim().length === 0) {
      throw new Error('AccountId cannot be empty');
    }
    return new AccountId(id.trim());
  }

  public static generate(): AccountId {
    return new AccountId(`acc_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: AccountId): boolean {
    return this.value === other.getValue();
  }
}
