import { Entity } from '../entity';
import { Identifier } from '../identifier';
import { IDomainEvent } from '@saas/events';
import { AggregateVersion } from '../types';

export abstract class AggregateRoot<TId extends Identifier<unknown>> extends Entity<TId> {
  private _domainEvents: IDomainEvent<unknown>[] = [];
  private _version: AggregateVersion = 0;

  get domainEvents(): IDomainEvent<unknown>[] {
    return this._domainEvents;
  }

  public pullEvents(): IDomainEvent<unknown>[] {
    const events = [...this._domainEvents];
    this.clearEvents();
    return events;
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }

  public version(): AggregateVersion {
    return this._version;
  }

  public incrementVersion(): void {
    this._version += 1;
  }

  protected record(event: IDomainEvent<unknown>): void {
    this._domainEvents.push(event);
  }
}
