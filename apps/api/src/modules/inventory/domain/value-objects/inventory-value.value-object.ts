import { ValueObject } from '@saas/core';
import { Money } from '../../../finance/domain/value-objects/money.value-object';
import { Quantity } from './quantity.value-object';

export interface InventoryValueProps {
  totalValue: Money;
  quantity: Quantity;
}

/**
 * Represents the total monetary value of a specific quantity of inventory.
 */
export class InventoryValue extends ValueObject<InventoryValueProps> {
  private constructor(props: InventoryValueProps) {
    super(props);
  }

  public static create(totalValue: Money, quantity: Quantity): InventoryValue {
    if (totalValue.amount.value < 0) {
      throw new Error('Inventory total value cannot be negative');
    }
    
    if (quantity.value < 0) {
      throw new Error('Quantity cannot be negative for inventory value');
    }

    return new InventoryValue({ totalValue, quantity });
  }

  get totalValue(): Money {
    return this.props.totalValue;
  }

  get quantity(): Quantity {
    return this.props.quantity;
  }
  
  public add(other: InventoryValue): InventoryValue {
    if (this.totalValue.currency.code !== other.totalValue.currency.code) {
      throw new Error('Cannot add inventory values with different currencies');
    }
    
    // Create new money
    const MoneyConstructor = this.totalValue.constructor as any;
    const newTotalValue = MoneyConstructor.create(
      this.totalValue.amount.value + other.totalValue.amount.value,
      this.totalValue.currency
    );
    
    const newQuantity = this.quantity.add(other.quantity);
    
    return InventoryValue.create(newTotalValue, newQuantity);
  }
}
