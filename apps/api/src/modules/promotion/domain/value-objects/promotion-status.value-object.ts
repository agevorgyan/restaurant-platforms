import { ValueObject } from '@saas/core';

export type PromotionStatusEnum = 'Draft' | 'Active' | 'Expired' | 'Disabled' | 'Paused';

interface PromotionStatusProps {
  value: PromotionStatusEnum;
}

export class PromotionStatus extends ValueObject<PromotionStatusProps> {
  private constructor(props: PromotionStatusProps) {
    super(props);
  }

  public get value(): PromotionStatusEnum {
    return this.props.value;
  }

  public static create(status: string): PromotionStatus {
    const valid: PromotionStatusEnum[] = ['Draft', 'Active', 'Expired', 'Disabled', 'Paused'];
    if (!valid.includes(status as PromotionStatusEnum)) {
      throw new Error(`Invalid Promotion Status: ${status}`);
    }
    return new PromotionStatus({ value: status as PromotionStatusEnum });
  }

  public canBeApplied(): boolean {
    return this.value === 'Active';
  }
}
