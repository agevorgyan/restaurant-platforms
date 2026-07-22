import { StockMovement } from '../entities/stock-movement.entity';
import { MovementTypeEnum } from '../value-objects/movement-type.value-object';

export class MovementReferenceSpecification {
  public static isSatisfiedBy(movement: StockMovement): boolean {
    // Specific movement types require specific references
    switch (movement.type.value) {
      case MovementTypeEnum.RECEIVE:
      case MovementTypeEnum.RETURN:
        if (!movement.reference?.purchaseOrderId && !movement.reference?.orderId) {
          throw new Error(`Movement type ${movement.type.value} requires a purchase order or order reference`);
        }
        break;
      case MovementTypeEnum.CONSUME:
      case MovementTypeEnum.PRODUCTION_CONSUMPTION:
        if (!movement.reference?.kitchenTicketId && !movement.reference?.orderId) {
          throw new Error(`Movement type ${movement.type.value} requires a kitchen ticket or order reference`);
        }
        break;
      case MovementTypeEnum.RESERVE:
      case MovementTypeEnum.RELEASE_RESERVATION:
        if (!movement.reference?.orderId) {
          throw new Error(`Movement type ${movement.type.value} requires an order reference`);
        }
        break;
      case MovementTypeEnum.TRANSFER_IN:
      case MovementTypeEnum.TRANSFER_OUT:
        if (!movement.source && !movement.destination) {
          throw new Error(`Movement type ${movement.type.value} requires source and destination`);
        }
        break;
    }

    return true;
  }
}
