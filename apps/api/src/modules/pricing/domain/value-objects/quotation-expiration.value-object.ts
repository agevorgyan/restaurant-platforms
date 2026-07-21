import { ValueObject } from '@saas/core';

export interface QuotationExpirationProps {
  expiresAt: Date;
  holdTimeMinutes: number;
}

export class QuotationExpiration extends ValueObject<QuotationExpirationProps> {
  private constructor(props: QuotationExpirationProps) {
    super(props);
  }

  public static create(holdTimeMinutes: number, publishedAt?: Date): QuotationExpiration {
    if (holdTimeMinutes <= 0) {
      throw new Error('Hold time must be greater than zero');
    }
    
    const baseDate = publishedAt || new Date();
    const expiresAt = new Date(baseDate.getTime() + holdTimeMinutes * 60000);
    
    return new QuotationExpiration({ expiresAt, holdTimeMinutes });
  }

  get expiresAt(): Date { return this.props.expiresAt; }
  get holdTimeMinutes(): number { return this.props.holdTimeMinutes; }

  public isExpired(now: Date = new Date()): boolean {
    return now > this.props.expiresAt;
  }
}
