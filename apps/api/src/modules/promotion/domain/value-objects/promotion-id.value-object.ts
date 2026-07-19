import { ValueObject } from '@saas/core';

interface PromotionIdProps {
  value: string;
}

export class PromotionId extends ValueObject<PromotionIdProps> {
  private constructor(props: PromotionIdProps) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id: string): PromotionId {
    if (!id || id.trim() === '') {
      throw new Error('PromotionId cannot be empty');
    }
    return new PromotionId({ value: id });
  }
}
