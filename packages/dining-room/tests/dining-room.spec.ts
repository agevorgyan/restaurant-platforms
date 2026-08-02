/**
 * Enterprise Dining Room & Floor Management Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Multi-Floor/Area Management, Presentation-Independent Coordinates (FloorCoordinates),
 * Non-Destructive Table Merge/Split, Capacity Reporting, Versioned Layout Snapshots, and CQRS Read Models.
 */

import { AreaStatus, TableStatus } from '../src/domain/enums/dining-room.enums';
import {
  FloorCoordinates,
  RotationAngle,
  TableCapacity,
} from '../src/domain/value-objects/dining-room-vo';
import { TableItemReadModel } from '../src/read-models/dining-room.read-models';
import {
  AreaService,
  CapacityService,
  EnterpriseDiningRoomPlatformService,
  FloorService,
  LayoutService,
  RelationshipService,
  TableService,
} from '../src/services/dining-room.services';

describe('Enterprise Dining Room & Floor Management Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format FloorCoordinates within normalized 0..1000 bounds', () => {
      const coords = FloorCoordinates.create(250, 450);
      expect(coords.x).toBe(250);
      expect(coords.y).toBe(450);

      const bounded = FloorCoordinates.create(-50, 1200);
      expect(bounded.x).toBe(0);
      expect(bounded.y).toBe(1000);
    });

    it('should calculate RotationAngle degrees correctly', () => {
      const angle = RotationAngle.create(90);
      expect(angle.degrees).toBe(90);

      const normalized = RotationAngle.create(450);
      expect(normalized.degrees).toBe(90);
    });

    it('should validate TableCapacity bounds', () => {
      const cap = TableCapacity.create(2, 6);
      expect(cap.minSeats).toBe(2);
      expect(cap.maxSeats).toBe(6);

      expect(() => TableCapacity.create(4, 2)).toThrow('Invalid capacity');
    });
  });

  describe('FloorService & AreaService & TableService', () => {
    let floorService: FloorService;
    let areaService: AreaService;
    let tableService: TableService;

    beforeEach(() => {
      floorService = new FloorService();
      areaService = new AreaService();
      tableService = new TableService();
    });

    it('should create floor and area and track table status lifecycle', () => {
      const floorId = floorService.createFloor('Terrace Floor');
      const areaId = areaService.createArea(floorId.id, 'VIP Lounge');

      const tableId = tableService.addTable(areaId.id, 'T-101', 2, 4, 300, 200);
      expect(tableId.id).toBeDefined();

      tableService.updateTableStatus(tableId.id, TableStatus.OCCUPIED);

      const stats = tableService.getTableStatistics();
      expect(stats.totalOccupied).toBe(1);
    });
  });

  describe('LayoutService & CapacityService', () => {
    let layoutService: LayoutService;
    let capacityService: CapacityService;

    beforeEach(() => {
      layoutService = new LayoutService();
      capacityService = new CapacityService();
    });

    it('should update table position and generate versioned layout snapshot', () => {
      const tables = [
        {
          tableId: 'tbl-1',
          tableNumber: '12',
          areaId: 'area-1',
          capacityMin: 2,
          capacityMax: 4,
          shape: 'RECTANGLE',
          x: 100,
          y: 100,
          rotation: 0,
          status: TableStatus.AVAILABLE,
        },
      ];

      layoutService.moveTable(tables, 'tbl-1', 400, 500, 90);
      expect(tables[0].x).toBe(400);
      expect(tables[0].y).toBe(500);
      expect(tables[0].rotation).toBe(90);

      const snapshot = layoutService.createSnapshot('flr-main', 12);
      expect(snapshot.version).toBe(1);
      expect(snapshot.tablesCount).toBe(12);
    });

    it('should calculate capacity utilization report', () => {
      const tables = [
        {
          tableId: 'tbl-1',
          tableNumber: '1',
          areaId: 'a1',
          capacityMin: 2,
          capacityMax: 4,
          shape: 'RECTANGLE',
          x: 100,
          y: 100,
          rotation: 0,
          status: TableStatus.OCCUPIED,
        },
        {
          tableId: 'tbl-2',
          tableNumber: '2',
          areaId: 'a1',
          capacityMin: 2,
          capacityMax: 4,
          shape: 'RECTANGLE',
          x: 200,
          y: 100,
          rotation: 0,
          status: TableStatus.AVAILABLE,
        },
      ];

      const report = capacityService.calculateCapacityReport('flr-main', tables);
      expect(report.totalCapacitySeats).toBe(8);
      expect(report.occupiedSeats).toBe(4);
      expect(report.occupancyRatePercentage).toBe(50);
    });
  });

  describe('RelationshipService & Non-Destructive Table Merge', () => {
    let relationshipService: RelationshipService;

    beforeEach(() => {
      relationshipService = new RelationshipService();
    });

    it('should merge secondary table into primary table without destroying original table entity', () => {
      const tables: TableItemReadModel[] = [
        {
          tableId: 'tbl-main',
          tableNumber: '10',
          areaId: 'a1',
          capacityMin: 2,
          capacityMax: 4,
          shape: 'RECTANGLE',
          x: 100,
          y: 100,
          rotation: 0,
          status: TableStatus.AVAILABLE,
        },
        {
          tableId: 'tbl-joint',
          tableNumber: '11',
          areaId: 'a1',
          capacityMin: 2,
          capacityMax: 4,
          shape: 'RECTANGLE',
          x: 150,
          y: 100,
          rotation: 0,
          status: TableStatus.AVAILABLE,
        },
      ];

      const rel = relationshipService.mergeTables('tbl-main', 'tbl-joint', tables);
      expect(rel.primaryTableId).toBe('tbl-main');
      expect(tables[1].mergedWithPrimaryTableId).toBe('tbl-main');

      relationshipService.splitTables('tbl-main', tables);
      expect(tables[1].mergedWithPrimaryTableId).toBeUndefined();
    });
  });

  describe('EnterpriseDiningRoomPlatformService & Read Models', () => {
    let floorService: FloorService;
    let areaService: AreaService;
    let tableService: TableService;
    let layoutService: LayoutService;
    let capacityService: CapacityService;
    let relationshipService: RelationshipService;
    let platformService: EnterpriseDiningRoomPlatformService;

    beforeEach(() => {
      floorService = new FloorService();
      areaService = new AreaService();
      tableService = new TableService();
      layoutService = new LayoutService();
      capacityService = new CapacityService();
      relationshipService = new RelationshipService();

      platformService = new EnterpriseDiningRoomPlatformService(
        floorService,
        areaService,
        tableService,
        layoutService,
        capacityService,
        relationshipService
      );
    });

    it('should query FloorOverview and TableMap read models', () => {
      const floorId = floorService.createFloor('Rooftop Floor');
      const areaId = areaService.createArea(floorId.id, 'Outdoor Deck');
      tableService.addTable(areaId.id, 'R-1', 4, 6, 200, 300);

      const overview = floorService.getFloorOverview(floorId.id);
      expect(overview.name).toBe('Rooftop Floor');

      const map = tableService.getTableMap(floorId.id, areaId.id);
      expect(map.tables.length).toBe(1);
    });
  });
});
