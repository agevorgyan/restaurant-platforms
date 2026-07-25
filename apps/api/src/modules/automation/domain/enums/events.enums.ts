export enum EventStatus {
  Pending = 'Pending',
  Published = 'Published',
  Delivered = 'Delivered',
  Processing = 'Processing',
  Completed = 'Completed',
  Failed = 'Failed',
  DeadLetter = 'DeadLetter',
  Replayed = 'Replayed',
}

export enum DeliveryGuarantee {
  AtMostOnce = 'AtMostOnce',
  AtLeastOnce = 'AtLeastOnce',
  ExactlyOnce = 'ExactlyOnce',
}
