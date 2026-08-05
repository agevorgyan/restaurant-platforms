export class AccountCode {
  private constructor(private readonly value: string) {}

  public static create(code: string): AccountCode {
    if (!code || code.trim().length === 0) {
      throw new Error('AccountCode cannot be empty');
    }
    const cleanCode = code.trim().toUpperCase();
    if (!/^[A-Z0-9.\-_]{2,30}$/.test(cleanCode)) {
      throw new Error(`Invalid AccountCode format: ${code}. Must be 2-30 alphanumeric characters with optional dots or hyphens.`);
    }
    return new AccountCode(cleanCode);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: AccountCode): boolean {
    return this.value === other.getValue();
  }
}
