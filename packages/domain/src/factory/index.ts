export interface DomainFactory<T> {
  create(...args: unknown[]): T;
  rehydrate(state: unknown): T;
  restore(state: unknown): T;
}
