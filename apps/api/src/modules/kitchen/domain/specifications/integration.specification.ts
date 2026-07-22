import { InventoryResponseReference } from '../value-objects/integration/inventory-response-reference.value-object';
import { ConsumptionRequest } from '../value-objects/integration/consumption-request.value-object';
import { ReservationRequestReference } from '../value-objects/integration/reservation-request-reference.value-object';

export class InventoryRequestSpecification {
  public static isValidReservationRequest(request: ReservationRequestReference): boolean {
    if (!request.items || request.items.length === 0) return false;
    for (const item of request.items) {
      if (item.quantity.value <= 0) return false;
    }
    return !!request.reference.correlationId;
  }

  public static isValidConsumptionRequest(request: ConsumptionRequest): boolean {
    if (!request.items || request.items.length === 0) return false;
    for (const item of request.items) {
      if (item.quantity.value <= 0) return false;
    }
    return !!request.reference.correlationId;
  }
}

export class InventoryResponseSpecification {
  public static isSuccessful(response: InventoryResponseReference): boolean {
    return response.success === true;
  }
}

export class KitchenInventoryIntegrationSpecification {
  public static isDuplicateRequest(
    newCorrelationId: string,
    existingCorrelationIds: string[]
  ): boolean {
    return existingCorrelationIds.includes(newCorrelationId);
  }
}
