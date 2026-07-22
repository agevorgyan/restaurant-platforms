import { Entity } from '@saas/core';
import { Money } from '../../../finance/domain/value-objects/money.value-object';
import { Currency } from '../../../finance/domain/value-objects/currency.value-object';

export enum ValuationMethodEnum {
  FIFO = 'FIFO',
  WEIGHTED_AVERAGE = 'WEIGHTED_AVERAGE',
}

export interface StockCostLayerProps {
  id: string;
  movementId: string;
  unitCost: Money;
  totalCost: Money;
  valuationMethod: ValuationMethodEnum;
  currency: Currency;
}

export class StockCostLayer extends Entity<StockCostLayerProps> {
  get id(): string {
    return this._id;
  }

  get movementId(): string {
    return this.props.movementId;
  }

  get unitCost(): Money {
    return this.props.unitCost;
  }

  get totalCost(): Money {
    return this.props.totalCost;
  }

  get valuationMethod(): ValuationMethodEnum {
    return this.props.valuationMethod;
  }

  get currency(): Currency {
    return this.props.currency;
  }

  private constructor(id: string, props: StockCostLayerProps) {
    super(id, props);
  }

  public static create(props: Omit<StockCostLayerProps, 'currency'>): StockCostLayer {
    if (!props.unitCost.currency.equals(props.totalCost.currency)) {
      throw new Error('Unit cost and total cost must be in the same currency');
    }
    
    return new StockCostLayer(props.id, {
      ...props,
      currency: props.unitCost.currency,
    });
  }
}
