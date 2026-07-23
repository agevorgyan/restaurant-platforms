export class IdempotencyKey {
  private constructor(private readonly value: string) {}

  public static generate(prefix?: string): IdempotencyKey {
    const raw = crypto.randomUUID();
    return new IdempotencyKey(prefix ? `${prefix}-${raw}` : raw);
  }

  public static validate(key: string): boolean {
    if (!key || typeof key !== 'string' || key.length === 0) return false;
    return true;
  }

  public compare(other: IdempotencyKey): boolean {
    return this.value === other.getValue();
  }

  public normalize(): string {
    return this.value.trim().toLowerCase();
  }

  public getValue(): string {
    return this.value;
  }
}
