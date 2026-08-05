export interface AccountBlockedPayload {
  tenantId: string;
  accountId: string;
  accountCode: string;
  blockedAt: Date;
  reason?: string;
}

export class AccountBlockedEvent {
  public readonly eventName = 'account.blocked';
  constructor(public readonly payload: AccountBlockedPayload) {}
}
