export class CreateCampaignEngagementDto {
  campaignReference!: string;
  targetReference!: string;
}

export class RegisterResponseDto {
  responseType!: string;
  source!: string;
  details?: string;
}

export class RegisterConversionDto {
  conversionType!: string;
  value!: number;
  currency!: string;
  relatedEntityId?: string;
}

export class RegisterUnsubscribeDto {
  reason!: string;
  feedback?: string;
}
