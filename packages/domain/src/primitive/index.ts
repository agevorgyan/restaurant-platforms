export abstract class DomainPrimitive<T> {
  public readonly value: T;

  constructor(value: T) {
    if (value === null || value === undefined) {
      throw new Error('Domain primitive value cannot be null or undefined');
    }
    this.value = value;
  }

  public toValue(): T {
    return this.value;
  }

  public equals(other?: DomainPrimitive<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof this.constructor)) {
      return false;
    }
    return JSON.stringify(this.value) === JSON.stringify(other.toValue());
  }
}
