export enum CustomerStatus {
  DRAFT = 'DRAFT',
  REGISTERED = 'REGISTERED',
  VERIFIED = 'VERIFIED',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  ARCHIVED = 'ARCHIVED'
}

export enum CustomerType {
  GUEST = 'GUEST',
  REGISTERED = 'REGISTERED',
  CORPORATE = 'CORPORATE',
  VIP = 'VIP',
  EMPLOYEE = 'EMPLOYEE'
}

export enum ContactMethod {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  APP_NOTIFICATION = 'APP_NOTIFICATION'
}

export enum AddressType {
  HOME = 'HOME',
  WORK = 'WORK',
  BILLING = 'BILLING',
  DELIVERY = 'DELIVERY',
  OTHER = 'OTHER'
}

export enum VerificationStatusEnum {
  UNVERIFIED = 'UNVERIFIED',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED'
}
