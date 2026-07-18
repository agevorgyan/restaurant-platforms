export const CustomerEventCatalog = {
  CustomerCreated: 'CustomerCreated',
  CustomerUpdated: 'CustomerUpdated',
  CustomerActivated: 'CustomerActivated',
  CustomerDeactivated: 'CustomerDeactivated',
  CustomerArchived: 'CustomerArchived',
  
  LoyaltyAccountCreated: 'LoyaltyAccountCreated',
  LoyaltyPointsEarned: 'LoyaltyPointsEarned',
  LoyaltyPointsRedeemed: 'LoyaltyPointsRedeemed',
  LoyaltyPointsExpired: 'LoyaltyPointsExpired',
  LoyaltyTierChanged: 'LoyaltyTierChanged',
  
  CustomerSegmentCreated: 'CustomerSegmentCreated',
  CustomerSegmentUpdated: 'CustomerSegmentUpdated',
  CustomerSegmentActivated: 'CustomerSegmentActivated',
  CustomerSegmentArchived: 'CustomerSegmentArchived',
  
  MembershipProgramCreated: 'MembershipProgramCreated',
  MembershipProgramActivated: 'MembershipProgramActivated',
  MembershipTierChanged: 'MembershipTierChanged',
  RewardPolicyCreated: 'RewardPolicyCreated',
  RewardPolicyPublished: 'RewardPolicyPublished',
  RewardRuleUpdated: 'RewardRuleUpdated',
  
  CommunicationProfileCreated: 'CommunicationProfileCreated',
  CommunicationConsentGranted: 'CommunicationConsentGranted',
  CommunicationConsentRevoked: 'CommunicationConsentRevoked',
  PreferredChannelChanged: 'PreferredChannelChanged',
  CommunicationProfileArchived: 'CommunicationProfileArchived',
  
  CustomerWalletCreated: 'CustomerWalletCreated',
  WalletCredited: 'WalletCredited',
  WalletDebited: 'WalletDebited',
  WalletAdjusted: 'WalletAdjusted',
  WalletFrozen: 'WalletFrozen',
  WalletUnfrozen: 'WalletUnfrozen',
  WalletArchived: 'WalletArchived'
} as const;

export type CustomerEventType = typeof CustomerEventCatalog[keyof typeof CustomerEventCatalog];
