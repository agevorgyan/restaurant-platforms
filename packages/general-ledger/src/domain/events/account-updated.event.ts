export interface AccountUpdatedPayload {
  tenantId: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  updatedAt: Date;
}

export class AccountUpdatedEvent {
  public readonly eventName = 'account.updated';
  constructor(public readonly payload: AccountUpdatedPayload) {}
}
