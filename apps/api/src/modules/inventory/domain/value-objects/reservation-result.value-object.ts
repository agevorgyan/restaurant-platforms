import { ValueObject } from '@saas/core';
import { Quantity } from './quantity.value-object';
import { StockMovement } from '../entities/stock-movement.entity';

export interface ReservationResultProps {
  isSuccessful: boolean;
  isPartial: boolean;
  reservedQuantity: Quantity;
  movementsGenerated: StockMovement[];
  errorMessage?: string;
}

export class ReservationResult extends ValueObject<ReservationResultProps> {
  private constructor(props: ReservationResultProps) {
    super(props);
  }

  public static success(reservedQuantity: Quantity, movementsGenerated: StockMovement[], isPartial: boolean = false): ReservationResult {
    return new ReservationResult({
      isSuccessful: true,
      isPartial,
      reservedQuantity,
      movementsGenerated
    });
  }

  public static failure(errorMessage: string, zeroQuantity: Quantity): ReservationResult {
    return new ReservationResult({
      isSuccessful: false,
      isPartial: false,
      reservedQuantity: zeroQuantity,
      movementsGenerated: [],
      errorMessage
    });
  }

  get isSuccessful(): boolean {
    return this.props.isSuccessful;
  }

  get isPartial(): boolean {
    return this.props.isPartial;
  }

  get reservedQuantity(): Quantity {
    return this.props.reservedQuantity;
  }

  get movementsGenerated(): StockMovement[] {
    return [...this.props.movementsGenerated];
  }

  get errorMessage(): string | undefined {
    return this.props.errorMessage;
  }
}
