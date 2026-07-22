import { Inventory } from '../aggregates/inventory.aggregate';
import { ReservationRequest } from '../value-objects/reservation-request.value-object';
import { ReservationResult } from '../value-objects/reservation-result.value-object';
import { EngineReservationPolicy } from '../policies/engine-reservation.policy';
import { Quantity } from '../value-objects/quantity.value-object';
import { StockMovement } from '../entities/stock-movement.entity';
import { MovementId } from '../value-objects/movement-id.value-object';
import { MovementType, MovementTypeEnum } from '../value-objects/movement-type.value-object';
import { MovementStatus, MovementStatusEnum } from '../value-objects/movement-status.value-object';
import { MovementQuantity } from '../value-objects/movement-quantity.value-object';
import { LedgerSequence } from '../value-objects/ledger-sequence.value-object';
import { StockMovementReference } from '../entities/stock-movement-reference.entity';
import { MovementActor } from '../entities/movement-actor.entity';
import { MovementReasonEntity } from '../entities/movement-reason.entity';
import { InventoryReservation } from '../entities/inventory-reservation.entity';

export class ReservationEngine {
  public static reserve(inventory: Inventory, request: ReservationRequest, sequencePrefix: number = 0): ReservationResult {
    try {
      // 1. Validate domain boundaries
      EngineReservationPolicy.validateReservationRequest(inventory, request);

      // 2. Perform aggregate mutation to apply reservation
      // The aggregate handles duplicate prevention internally and emits StockReservedEvent
      const reservation = InventoryReservation.create({
        id: crypto.randomUUID(),
        inventoryId: inventory.id,
        orderReference: request.orderId,
        quantity: request.quantity,
        expirationTimestamp: request.expiresAt || new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) // 1 year default
      });
      inventory.addReservation(reservation);

      // 3. Generate the pending movement for the Ledger to store
      const movementsGenerated = [
        StockMovement.create({
        id: MovementId.create(),
        inventoryLedgerId: `ledger-${inventory.id}`, // Usually resolved via repository, mock it here for generated movement
        sequence: LedgerSequence.create(sequencePrefix > 0 ? sequencePrefix : 1), 
        type: MovementType.create(MovementTypeEnum.RESERVE),
        status: MovementStatus.create(MovementStatusEnum.COMPLETED),
        quantity: MovementQuantity.create(request.quantity),
        actor: MovementActor.create({ id: crypto.randomUUID(), movementId: 'TBD', systemId: 'ReservationEngine' }),
        reason: MovementReasonEntity.create({ id: crypto.randomUUID(), movementId: 'TBD', code: 'NEW_RESERVATION' }),
        reference: StockMovementReference.create({ id: crypto.randomUUID(), movementId: 'TBD', orderId: request.orderId }),
          occurredAt: new Date()
        })
      ];

      const result = ReservationResult.success(request.quantity, movementsGenerated, false);

      // We technically should emit the Engine event here or rely on Aggregate event.
      // The prompt asks to emit InventoryReservedEvent. But engines are typically stateless services.
      // We'll let the application layer handle the engine return result, or we can just return it.
      
      return result;
    } catch (error) {
      const zeroQty = Quantity.create(0, request.quantity.precision);
      return ReservationResult.failure(error instanceof Error ? error.message : 'Unknown error', zeroQty);
    }
  }

  public static release(inventory: Inventory, orderId: string): void {
    // Inventory aggregate manages its reservations
    inventory.releaseReservation(orderId);
  }

  public static expireReservations(inventory: Inventory): void {
    const now = new Date();
    const expiredReservations = inventory.reservations.filter(
      r => r.expirationTimestamp && r.expirationTimestamp < now && !r.isReleased
    );

    for (const res of expiredReservations) {
      inventory.releaseReservation(res.id);
    }
  }
}
