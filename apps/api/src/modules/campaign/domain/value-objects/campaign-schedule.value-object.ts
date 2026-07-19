import { ValueObject } from '@saas/core';

export interface CampaignScheduleProps {
  startDate: Date;
  endDate: Date;
}

export class CampaignSchedule extends ValueObject<CampaignScheduleProps> {
  private constructor(props: CampaignScheduleProps) {
    super(props);
  }

  public static create(startDate: Date, endDate: Date): CampaignSchedule {
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }
    if (startDate.getTime() >= endDate.getTime()) {
      throw new Error('Start date must be before end date');
    }
    return new CampaignSchedule({ startDate, endDate });
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get endDate(): Date {
    return this.props.endDate;
  }
}
