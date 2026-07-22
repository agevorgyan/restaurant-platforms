import { ValuationMethod, ValuationMethodEnum } from '../value-objects/valuation-method.value-object';

export class InventoryValuationSpecification {
  public static isSatisfiedBy(method: ValuationMethod): boolean {
    if (!method) {
      throw new Error('Valuation method is required');
    }

    const validMethods = [
      ValuationMethodEnum.FIFO,
      ValuationMethodEnum.WEIGHTED_AVERAGE,
      ValuationMethodEnum.MOVING_AVERAGE
    ];

    if (!validMethods.includes(method.value)) {
      throw new Error(`Valuation method ${method.value} is not supported for calculations`);
    }

    return true;
  }
}
