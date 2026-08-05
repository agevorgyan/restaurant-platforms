export interface PostingRuleChangedPayload {
  tenantId: string;
  accountId: string;
  accountCode: string;
  allowManualPosting: boolean;
  allowAutomatedPosting: boolean;
  requireDimensionTag: boolean;
  updatedAt: Date;
}

export class PostingRuleChangedEvent {
  public readonly eventName = 'posting_rule.changed';
  constructor(public readonly payload: PostingRuleChangedPayload) {}
}
