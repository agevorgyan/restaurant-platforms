export interface AccountArchivedPayload {
  tenantId: string;
  accountId: string;
  accountCode: string;
  archivedAt: Date;
}

export class AccountArchivedEvent {
  public readonly eventName = 'account.archived';
  constructor(public readonly payload: AccountArchivedPayload) {}
}
