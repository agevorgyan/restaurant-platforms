import { ValueObject } from '@saas/core';

export interface CampaignNameProps {
  value: string;
}

export class CampaignName extends ValueObject<CampaignNameProps> {
  private constructor(props: CampaignNameProps) {
    super(props);
  }

  public static create(value: string): CampaignName {
    if (!value || value.trim().length === 0) {
      throw new Error('Campaign name cannot be empty');
    }
    return new CampaignName({ value: value.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
