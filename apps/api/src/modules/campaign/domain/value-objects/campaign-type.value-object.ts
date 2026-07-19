import { ValueObject } from '../base/value-object';

export enum CampaignTypeEnum {
  DISCOUNT = 'DISCOUNT',
  BOGO = 'BOGO',
  LOYALTY = 'LOYALTY',
  PROMOTION = 'PROMOTION',
}

export interface CampaignTypeProps {
  value: CampaignTypeEnum;
}

export class CampaignType extends ValueObject<CampaignTypeProps> {
  private constructor(props: CampaignTypeProps) {
    super(props);
  }

  public static create(value: string): CampaignType {
    const enumValue = Object.values(CampaignTypeEnum).find((v) => v === value);
    if (!enumValue) {
      throw new Error(`Invalid CampaignType: ${value}`);
    }
    return new CampaignType({ value: enumValue });
  }

  get value(): CampaignTypeEnum {
    return this.props.value;
  }
}
