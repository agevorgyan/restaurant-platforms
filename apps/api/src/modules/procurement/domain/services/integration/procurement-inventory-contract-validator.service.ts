import { InventoryRequestSpecification } from '../../specifications/integration.specifications';

export class ProcurementInventoryContractValidator {
  public validateOutboundRequest(payload: any): void {
    if (!InventoryRequestSpecification.isSatisfiedBy(payload)) {
      throw new Error('Outbound inventory request fails contract validation');
    }
  }

  public validateInboundResponse(response: any): void {
    // Inventory validates every request, but Procurement also validates the incoming ack structure
    if (!response.correlationId) {
      throw new Error('Inbound inventory response missing correlation ID');
    }
  }
}