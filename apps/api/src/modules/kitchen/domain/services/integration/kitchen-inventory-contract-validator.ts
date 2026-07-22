import { ConsumptionRequest } from '../../value-objects/integration/consumption-request.value-object';
import { ReservationRequestReference } from '../../value-objects/integration/reservation-request-reference.value-object';
import { InventoryResponseReference } from '../../value-objects/integration/inventory-response-reference.value-object';
import { InventoryRequestSpecification } from '../../specifications/integration.specification';

export class KitchenInventoryContractValidator {
  public static validateOutboundConsumption(request: ConsumptionRequest): void {
    if (!InventoryRequestSpecification.isValidConsumptionRequest(request)) {
      throw new Error('Invalid outbound consumption request contract');
    }
  }

  public static validateOutboundReservation(request: ReservationRequestReference): void {
    if (!InventoryRequestSpecification.isValidReservationRequest(request)) {
      throw new Error('Invalid outbound reservation request contract');
    }
  }

  public static validateInboundResponse(response: InventoryResponseReference): void {
    if (!response.correlationId) {
      throw new Error('Inbound inventory response missing correlationId');
    }
    // We can accept failures, but the object itself must be well-formed
  }
}
