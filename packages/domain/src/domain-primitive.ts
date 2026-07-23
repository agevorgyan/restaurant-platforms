export abstract class DomainPrimitive<T> {
  constructor(protected readonly value: T) {}

  public getValue(): T {
    return this.value;
  }

  public equals(other: DomainPrimitive<T>): boolean {
    if (other === null || other === undefined) return false;
    if (other.getValue() === undefined) return false;
    return this.value === other.getValue();
  }
}
