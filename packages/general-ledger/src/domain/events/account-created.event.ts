export interface AccountCreatedPayload {
  tenantId: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  parentAccountId?: string;
  createdAt: Date;
}

export class AccountCreatedEvent {
  public readonly eventName = 'account.created';
  constructor(public readonly payload: AccountCreatedPayload) {}
}
