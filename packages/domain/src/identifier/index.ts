export abstract class Identifier<T> {
  constructor(public readonly value: T) {
    if (value === null || value === undefined) {
      throw new Error('Identifier cannot be null or undefined');
    }
  }

  public equals(id?: Identifier<T>): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    if (!(id instanceof this.constructor)) {
      return false;
    }
    return id.toValue() === this.value;
  }

  public toValue(): T {
    return this.value;
  }

  public toString(): string {
    return String(this.value);
  }
}
