import { ValueObject } from '@saas/core';

export interface SupplierRatingProps {
  score: number; // e.g. 0 to 5
}

export class SupplierRating extends ValueObject<SupplierRatingProps> {
  get score(): number {
    return this.props.score;
  }

  private constructor(props: SupplierRatingProps) {
    super(props);
  }

  public static create(score: number): SupplierRating {
    if (score < 0 || score > 5) {
      throw new Error('Supplier rating must be between 0 and 5');
    }
    return new SupplierRating({ score });
  }

  public static unrated(): SupplierRating {
    return new SupplierRating({ score: 0 });
  }
}
