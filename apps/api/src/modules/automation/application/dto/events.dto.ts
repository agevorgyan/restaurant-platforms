export class PublishEventDto {
  type!: string;
  payload!: Record<string, any>;
  metadata!: {
    tenantId: string;
    timestamp: Date;
    signature?: string;
  };
  topic!: string;
}

export class CreateSubscriptionDto {
  topic!: string;
  deliveryGuarantee!: 'AtMostOnce' | 'AtLeastOnce' | 'ExactlyOnce';
  filterExpression?: string;
}

export class ReplayEventsDto {
  topic!: string;
  fromTimestamp!: Date;
  toTimestamp?: Date;
}
