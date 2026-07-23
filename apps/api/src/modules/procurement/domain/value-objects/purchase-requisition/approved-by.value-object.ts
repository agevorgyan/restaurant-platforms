import { ValueObject } from '@saas/core';

export interface ApprovedByProps {
  userId: string;
  userName?: string;
  approvalDate: Date;
}

export class ApprovedBy extends ValueObject<ApprovedByProps> {
  get userId(): string {
    return this.props.userId;
  }

  get userName(): string | undefined {
    return this.props.userName;
  }

  get approvalDate(): Date {
    return this.props.approvalDate;
  }

  private constructor(props: ApprovedByProps) {
    super(props);
  }

  public static create(userId: string, userName?: string, approvalDate: Date = new Date()): ApprovedBy {
    if (!userId || userId.trim() === '') {
      throw new Error('Approver User ID is required');
    }
    return new ApprovedBy({ userId: userId.trim(), userName, approvalDate });
  }
}
