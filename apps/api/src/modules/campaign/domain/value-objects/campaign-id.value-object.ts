import { ValueObject } from '../base/value-object';

export interface CampaignIdProps {
  value: string;
}

export class CampaignId extends ValueObject<CampaignIdProps> {
  private constructor(props: CampaignIdProps) {
    super(props);
  }

  public static create(value: string): CampaignId {
    if (!value || value.trim().length === 0) {
      throw new Error('CampaignId cannot be empty');
    }
    return new CampaignId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
