import { ValueObject } from '../base/value-object';

export enum CampaignStatusEnum {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface CampaignStatusProps {
  value: CampaignStatusEnum;
}

export class CampaignStatus extends ValueObject<CampaignStatusProps> {
  private constructor(props: CampaignStatusProps) {
    super(props);
  }

  public static create(value: string): CampaignStatus {
    const enumValue = Object.values(CampaignStatusEnum).find((v) => v === value);
    if (!enumValue) {
      throw new Error(`Invalid CampaignStatus: ${value}`);
    }
    return new CampaignStatus({ value: enumValue });
  }

  public static initial(): CampaignStatus {
    return new CampaignStatus({ value: CampaignStatusEnum.DRAFT });
  }

  get value(): CampaignStatusEnum {
    return this.props.value;
  }

  public isActive(): boolean {
    return this.props.value === CampaignStatusEnum.ACTIVE;
  }

  public isDraft(): boolean {
    return this.props.value === CampaignStatusEnum.DRAFT;
  }

  public isCompleted(): boolean {
    return this.props.value === CampaignStatusEnum.COMPLETED;
  }

  public isCancelled(): boolean {
    return this.props.value === CampaignStatusEnum.CANCELLED;
  }

  public isPaused(): boolean {
    return this.props.value === CampaignStatusEnum.PAUSED;
  }
}
