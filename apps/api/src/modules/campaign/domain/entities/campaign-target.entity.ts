import { Entity } from '../base/entity';

export interface CampaignTargetProps {
  audienceSegmentIds: string[];
  locationIds: string[];
  customerTags: string[];
}

export class CampaignTarget extends Entity<CampaignTargetProps> {
  private constructor(id: string, props: CampaignTargetProps) {
    super(id, props);
  }

  public static create(
    id: string,
    props: { audienceSegmentIds?: string[]; locationIds?: string[]; customerTags?: string[] }
  ): CampaignTarget {
    return new CampaignTarget(id, {
      audienceSegmentIds: props.audienceSegmentIds || [],
      locationIds: props.locationIds || [],
      customerTags: props.customerTags || [],
    });
  }

  get audienceSegmentIds(): string[] {
    return [...this.props.audienceSegmentIds];
  }

  get locationIds(): string[] {
    return [...this.props.locationIds];
  }

  get customerTags(): string[] {
    return [...this.props.customerTags];
  }

  public updateTarget(props: Partial<CampaignTargetProps>): void {
    if (props.audienceSegmentIds) {
      this.props.audienceSegmentIds = [...props.audienceSegmentIds];
    }
    if (props.locationIds) {
      this.props.locationIds = [...props.locationIds];
    }
    if (props.customerTags) {
      this.props.customerTags = [...props.customerTags];
    }
  }
}
