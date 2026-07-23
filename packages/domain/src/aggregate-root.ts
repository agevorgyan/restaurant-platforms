import { Entity } from './entity';
import { Identifier } from './identifier';
import { DomainEvent } from '@saas/events';

export abstract class AggregateRoot<TId extends Identifier<unknown>> extends Entity<TId> {
  private _domainEvents: DomainEvent[] = [];
  private _version: number = 0;

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  public pullEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this.clearEvents();
    return events;
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }

  public version(): number {
    return this._version;
  }

  public incrementVersion(): void {
    this._version += 1;
  }

  protected record(event: DomainEvent): void {
    this._domainEvents.push(event);
  }
}
