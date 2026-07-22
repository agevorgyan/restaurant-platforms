import { Production } from '../../aggregates/production.aggregate';
import { ConsumptionRequest, ConsumptionItem } from '../../value-objects/integration/consumption-request.value-object';
import { ReservationRequestReference, ReservationItem } from '../../value-objects/integration/reservation-request-reference.value-object';
import { InventoryRequestReference } from '../../value-objects/integration/inventory-request-reference.value-object';

export class KitchenInventoryMapper {
  public static mapProductionToConsumptionRequest(production: Production, correlationId: string): ConsumptionRequest {
    const reference = InventoryRequestReference.create(correlationId, 'KITCHEN_PRODUCTION');
    
    const items: ConsumptionItem[] = production.ingredients.map(ing => ({
      ingredientId: ing.ingredientReference.externalId,
      quantity: ing.plannedQuantity.quantity // Assuming consuming exactly what was planned for now
    }));

    return ConsumptionRequest.create(reference, production.id, items);
  }

  public static mapProductionToReservationRequest(production: Production, correlationId: string): ReservationRequestReference {
    const reference = InventoryRequestReference.create(correlationId, 'KITCHEN_PRODUCTION');
    
    const items: ReservationItem[] = production.ingredients.map(ing => ({
      ingredientId: ing.ingredientReference.externalId,
      quantity: ing.plannedQuantity.quantity
    }));

    return ReservationRequestReference.create(reference, items, undefined, production.id);
  }
}
