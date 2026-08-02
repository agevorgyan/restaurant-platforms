/**
 * Enterprise Warehouse & Stock Movement Platform - Comprehensive Test Suite
 *
 * Tests Append-Only Immutable Stock Ledger, Double-Entry Inter-Warehouse Transfers,
 * Non-Reducing Stock Reservations, Dynamic Availability Matrix Engine, and CQRS Read Models.
 */

import { MovementStatus, MovementType } from '../src/domain/enums/warehouse-movement.enums';
import {
  MovementQuantity,
  StockReservation,
  WarehouseId,
} from '../src/domain/value-objects/warehouse-movement-vo';
import {
  AvailabilityService,
  EnterpriseWarehousePlatformService,
  MovementValidationService,
  ReservationService,
  StockLedgerService,
  TransferService,
  WarehouseService,
} from '../src/services/warehouse-movement.services';

describe('Enterprise Warehouse & Stock Movement Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format WarehouseId and MovementQuantity correctly', () => {
      const whId = WarehouseId.create('wh-central-01');
      expect(whId.id).toBe('wh-central-01');

      const qty = MovementQuantity.create(150);
      expect(qty.amount).toBe(150);
    });
  });

  describe('StockLedgerService & Append-Only Ledger', () => {
    let validator: MovementValidationService;
    let ledgerService: StockLedgerService;

    beforeEach(() => {
      validator = new MovementValidationService();
      ledgerService = new StockLedgerService(validator);
    });

    it('should record append-only movements and calculate physical stock', () => {
      ledgerService.recordMovement('wh-central', 'item-flour', MovementType.PURCHASE_RECEIPT, 100);
      ledgerService.recordMovement('wh-central', 'item-flour', MovementType.CONSUMPTION, -20);

      const physical = ledgerService.calculatePhysicalStock('wh-central', 'item-flour');
      expect(physical).toBe(80);

      const ledger = ledgerService.getMovementLedger('wh-central');
      expect(ledger.totalEntriesCount).toBe(2);
    });
  });

  describe('TransferService & Double-Entry Transfers', () => {
    let validator: MovementValidationService;
    let ledgerService: StockLedgerService;
    let transferService: TransferService;

    beforeEach(() => {
      validator = new MovementValidationService();
      ledgerService = new StockLedgerService(validator);
      transferService = new TransferService(validator, ledgerService);
    });

    it('should execute double-entry inter-warehouse transfer (OUT from source, IN to destination)', () => {
      // Seed source warehouse with 100 units
      ledgerService.recordMovement('wh-central', 'item-sugar', MovementType.PURCHASE_RECEIPT, 100);

      const transferRef = transferService.executeTransfer('wh-central', 'wh-kitchen', 'item-sugar', 30);
      expect(transferRef).toBeDefined();

      const sourceStock = ledgerService.calculatePhysicalStock('wh-central', 'item-sugar');
      const destStock = ledgerService.calculatePhysicalStock('wh-kitchen', 'item-sugar');

      expect(sourceStock).toBe(70);
      expect(destStock).toBe(30);
    });

    it('should reject transfer when physical stock is insufficient', () => {
      expect(() => {
        transferService.executeTransfer('wh-central', 'wh-kitchen', 'item-cheese', 500);
      }).toThrow('Transfer error: Insufficient physical stock');
    });
  });

  describe('ReservationService & AvailabilityService', () => {
    let validator: MovementValidationService;
    let ledgerService: StockLedgerService;
    let reservationService: ReservationService;
    let availabilityService: AvailabilityService;

    beforeEach(() => {
      validator = new MovementValidationService();
      ledgerService = new StockLedgerService(validator);
      reservationService = new ReservationService(ledgerService);
      availabilityService = new AvailabilityService(ledgerService, reservationService);
    });

    it('should create soft reservation without reducing physical stock and calculate net availability', () => {
      // Seed physical stock 100
      ledgerService.recordMovement('wh-central', 'item-beef', MovementType.PURCHASE_RECEIPT, 100);

      const resv = reservationService.reserveStock('wh-central', 'item-beef', 25);
      expect(resv.reservationId).toBeDefined();

      // Physical stock remains 100
      const physical = ledgerService.calculatePhysicalStock('wh-central', 'item-beef');
      expect(physical).toBe(100);

      // Net available stock is 75 (100 - 25)
      const matrix = availabilityService.getAvailabilityMatrix('wh-central', 'item-beef');
      expect(matrix.physicalStock).toBe(100);
      expect(matrix.reservedStock).toBe(25);
      expect(matrix.netAvailableStock).toBe(75);
    });
  });

  describe('EnterpriseWarehousePlatformService Façade Integration', () => {
    let validator: MovementValidationService;
    let warehouseService: WarehouseService;
    let ledgerService: StockLedgerService;
    let reservationService: ReservationService;
    let transferService: TransferService;
    let availabilityService: AvailabilityService;
    let platformService: EnterpriseWarehousePlatformService;

    beforeEach(() => {
      validator = new MovementValidationService();
      warehouseService = new WarehouseService();
      ledgerService = new StockLedgerService(validator);
      reservationService = new ReservationService(ledgerService);
      transferService = new TransferService(validator, ledgerService);
      availabilityService = new AvailabilityService(ledgerService, reservationService);

      platformService = new EnterpriseWarehousePlatformService(
        validator,
        warehouseService,
        ledgerService,
        reservationService,
        transferService,
        availabilityService
      );
    });

    it('should query WarehouseOverview via platform facade', () => {
      const overview = platformService.warehouseService.getWarehouseOverview();
      expect(overview.totalWarehousesCount).toBeGreaterThan(0);
    });
  });
});
