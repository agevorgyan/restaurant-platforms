import { IDomainEvent } from './domain-event.interface';

export class CustomerWalletCreatedEvent implements IDomainEvent {
  public readonly eventName = 'CustomerWalletCreated';
  public readonly occurredOn = new Date();

  constructor(
    public readonly walletId: string,
    public readonly customerId: string,
    public readonly walletNumber: string
  ) {}
}

export class WalletCreditedEvent implements IDomainEvent {
  public readonly eventName = 'WalletCredited';
  public readonly occurredOn = new Date();

  constructor(
    public readonly walletId: string,
    public readonly transactionId: string,
    public readonly amount: number
  ) {}
}

export class WalletDebitedEvent implements IDomainEvent {
  public readonly eventName = 'WalletDebited';
  public readonly occurredOn = new Date();

  constructor(
    public readonly walletId: string,
    public readonly transactionId: string,
    public readonly amount: number
  ) {}
}

export class WalletAdjustedEvent implements IDomainEvent {
  public readonly eventName = 'WalletAdjusted';
  public readonly occurredOn = new Date();

  constructor(
    public readonly walletId: string,
    public readonly transactionId: string,
    public readonly amount: number
  ) {}
}

export class WalletFrozenEvent implements IDomainEvent {
  public readonly eventName = 'WalletFrozen';
  public readonly occurredOn = new Date();

  constructor(
    public readonly walletId: string
  ) {}
}

export class WalletUnfrozenEvent implements IDomainEvent {
  public readonly eventName = 'WalletUnfrozen';
  public readonly occurredOn = new Date();

  constructor(
    public readonly walletId: string
  ) {}
}

export class WalletArchivedEvent implements IDomainEvent {
  public readonly eventName = 'WalletArchived';
  public readonly occurredOn = new Date();

  constructor(
    public readonly walletId: string
  ) {}
}
