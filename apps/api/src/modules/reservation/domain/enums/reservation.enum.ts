export enum ReservationStatusEnum {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SEATED = 'SEATED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export enum ReservationTypeEnum {
  STANDARD = 'STANDARD',
  VIP = 'VIP',
  EVENT = 'EVENT',
  LARGE_PARTY = 'LARGE_PARTY'
}

export enum ReservationSourceEnum {
  WALK_IN = 'WALK_IN',
  PHONE = 'PHONE',
  WEBSITE = 'WEBSITE',
  THIRD_PARTY = 'THIRD_PARTY'
}

export enum ReservationPriorityEnum {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum ReservationChannelEnum {
  DIRECT = 'DIRECT',
  PARTNER = 'PARTNER'
}

export enum ReservationStateEnum {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED'
}