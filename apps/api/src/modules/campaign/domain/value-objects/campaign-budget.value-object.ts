import { ValueObject } from '../base/value-object';

export interface CampaignBudgetProps {
  amount: number;
  currency: string;
}

export class CampaignBudget extends ValueObject<CampaignBudgetProps> {
  private constructor(props: CampaignBudgetProps) {
    super(props);
  }

  public static create(amount: number, currency: string = 'USD'): CampaignBudget {
    if (amount < 0) {
      throw new Error('Campaign budget cannot be negative');
    }
    if (!currency || currency.trim().length !== 3) {
      throw new Error('Currency must be a 3-letter code');
    }
    return new CampaignBudget({ amount, currency: currency.toUpperCase() });
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }
}
