import { Entity, Identifier } from '@saas/domain';

export class CampaignResponseId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CampaignResponseId { return new CampaignResponseId(value); }
  public static generate(): CampaignResponseId { return new CampaignResponseId(crypto.randomUUID()); }
}

export class CampaignResponse extends Entity<CampaignResponseId> {
  constructor(
    id: CampaignResponseId,
    public readonly responseType: string,
    public readonly timestamp: Date,
    public readonly source: string,
    public readonly details?: string
  ) {
    super(id);
  }

  public static create(responseType: string, source: string, details?: string): CampaignResponse {
    return new CampaignResponse(CampaignResponseId.generate(), responseType, new Date(), source, details);
  }
}
