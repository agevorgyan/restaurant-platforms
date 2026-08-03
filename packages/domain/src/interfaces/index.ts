import { AggregateVersion } from '../types';
import { IDomainEvent } from '@saas/events';

export interface IIdentifier<T> {
  equals(id?: IIdentifier<T>): boolean;
  toValue(): T;
  toString(): string;
}

export interface IEntity<TId extends IIdentifier<unknown>> {
  readonly id: TId;
  equals(object?: IEntity<TId>): boolean;
}

export interface IAggregateRoot<TId extends IIdentifier<unknown>> extends IEntity<TId> {
  readonly domainEvents: IDomainEvent<unknown>[];
  pullEvents(): IDomainEvent<unknown>[];
  clearEvents(): void;
  version(): AggregateVersion;
  incrementVersion(): void;
}

export interface IDomainFactory<T> {
  create(...args: unknown[]): T;
  rehydrate(state: unknown): T;
  restore(state: unknown): T;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDomainService {}

export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface IUnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
