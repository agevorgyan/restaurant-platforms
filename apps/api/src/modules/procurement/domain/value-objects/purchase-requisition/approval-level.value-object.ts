import { ValueObject } from '@saas/core';

export interface ApprovalLevelProps {
  level: number;
  description?: string;
}

export class ApprovalLevel extends ValueObject<ApprovalLevelProps> {
  get level(): number {
    return this.props.level;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  private constructor(props: ApprovalLevelProps) {
    super(props);
  }

  public static create(level: number, description?: string): ApprovalLevel {
    if (level < 1) {
      throw new Error('Approval level must be at least 1');
    }
    return new ApprovalLevel({ level, description });
  }
}
