export interface Identifier<T> {
  toValue(): T;
  equals(id: Identifier<T>): boolean;
}
