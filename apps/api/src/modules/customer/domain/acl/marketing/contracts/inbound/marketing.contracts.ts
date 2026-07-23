export interface CampaignAssignedContract {
  version: '1.0';
  campaignId: string;
  customerId: string;
  assignedAt: Date;
}

export interface CampaignRemovedContract {
  version: '1.0';
  campaignId: string;
  customerId: string;
  removedAt: Date;
}

export interface SegmentUpdatedContract {
  version: '1.0';
  segmentId: string;
  customerId: string;
  updatedAt: Date;
}

export interface PromotionAssignedContract {
  version: '1.0';
  promotionId: string;
  customerId: string;
  assignedAt: Date;
}

export interface PromotionRevokedContract {
  version: '1.0';
  promotionId: string;
  customerId: string;
  revokedAt: Date;
}