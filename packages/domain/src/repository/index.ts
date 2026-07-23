export interface ReadRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
}

export interface WriteRepository<T> {
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface Repository<T> extends ReadRepository<T>, WriteRepository<T> {}

export type AggregateRepository<T> = Repository<T>;

export interface UnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
