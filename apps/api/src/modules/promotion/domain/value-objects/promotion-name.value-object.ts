import { ValueObject } from '@saas/core';

interface PromotionNameProps {
  value: string;
}

export class PromotionName extends ValueObject<PromotionNameProps> {
  private constructor(props: PromotionNameProps) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(name: string): PromotionName {
    if (!name || name.trim() === '') {
      throw new Error('PromotionName cannot be empty');
    }
    return new PromotionName({ value: name });
  }
}
