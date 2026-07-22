import { ValueObject } from '@saas/core';

export interface ShelfLifeProps {
  days: number;
}

export class ShelfLife extends ValueObject<ShelfLifeProps> {
  private constructor(props: ShelfLifeProps) {
    super(props);
  }

  public static create(days: number): ShelfLife {
    if (!Number.isInteger(days) || days <= 0) {
      throw new Error('Shelf life must be a non-negative integer of days greater than zero');
    }
    return new ShelfLife({ days });
  }

  public calculateExpirationDate(manufacturingDate: Date): Date {
    const expirationDate = new Date(manufacturingDate.getTime());
    expirationDate.setDate(expirationDate.getDate() + this.props.days);
    return expirationDate;
  }

  get days(): number {
    return this.props.days;
  }
}
