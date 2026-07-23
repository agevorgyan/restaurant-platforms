export enum LoyaltyStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED'
}

export enum LoyaltyTier {
  BASIC = 'BASIC',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM'
}

export enum TransactionType {
  EARN = 'EARN',
  REDEEM = 'REDEEM',
  EXPIRE = 'EXPIRE',
  ADJUSTMENT = 'ADJUSTMENT',
  REFUND = 'REFUND',
  PROMOTION = 'PROMOTION'
}