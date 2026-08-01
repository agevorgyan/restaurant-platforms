/**
 * Enterprise Business Intelligence Platform - Comprehensive Test Suite
 *
 * Tests Semantic Models, OLAP Cubes, Multidimensional Slice & Dice, Pivot Analysis,
 * Drill Down / Drill Through, RLS Tenant Security, Domain Events, and Read Models.
 */

import {
  BusinessDimensionId,
  BusinessMeasureId,
  CubeId,
  CubeDefinition,
  AnalyticalQuery,
  DrillPath,
  FilterSet,
  SemanticModel,
  ReportContext,
} from './domain/value-objects/bi-vo';
import {
  AnalysisType,
  DimensionType,
  MeasureType,
  DrillMode,
  CubeStatus,
  AggregationLevel,
} from './domain/enums/bi.enums';
import { CubeAggregate } from './domain/models/cube.aggregate';
import { InMemoryBiRepository } from './infrastructure/repositories/in-memory-bi.repository';
import { NestEventPublisherAdapter } from '../integration/infrastructure/adapters/connector.adapters';
import {
  SemanticModelService,
  CubeService,
  AnalyticalQueryService,
  DrillService,
  BiAggregationService,
  BiDimensionService,
  EnterpriseBiPlatformService,
} from './application/services/bi-platform.services';
import { UnauthorizedAnalyticalAccessException, InvalidDimensionException } from './domain/exceptions/bi.exceptions';

describe('Enterprise Business Intelligence Platform', () => {
  describe('Value Objects & Validation', () => {
    it('should generate unique IDs for dimensions, measures, and cubes', () => {
      const dimId = BusinessDimensionId.create();
      const measId = BusinessMeasureId.create();
      const cubeId = CubeId.create();

      expect(dimId.getValue()).toMatch(/^dim-/);
      expect(measId.getValue()).toMatch(/^meas-/);
      expect(cubeId.getValue()).toMatch(/^cube-/);
    });

    it('should throw exception when creating CubeDefinition with empty dimensions or measures', () => {
      expect(() =>
        CubeDefinition.create({
          name: 'Invalid Cube',
          analysisType: AnalysisType.FINANCIAL,
          dimensions: [],
          measures: [{ type: MeasureType.REVENUE, name: 'Revenue', unit: 'USD', aggregationFormula: 'SUM' }],
          tenantId: 'tenant-1',
        })
      ).toThrow(InvalidDimensionException);
    });
  });

  describe('CubeAggregate Root & Lifecycle', () => {
    it('should handle complete cube lifecycle: Create -> Build -> Refresh -> Deprecate -> Archive', () => {
      const cube = CubeAggregate.create({
        name: 'Sales OLAP Cube',
        analysisType: AnalysisType.SALES,
        dimensions: [{ type: DimensionType.RESTAURANT, name: 'Restaurant', hierarchies: ['StoreId'] }],
        measures: [{ type: MeasureType.REVENUE, name: 'Revenue', unit: 'USD', aggregationFormula: 'SUM' }],
        tenantId: 'tenant-sales-1',
      });

      expect(cube.getStatus()).toBe(CubeStatus.DRAFT);
      expect(cube.getUncommittedEvents().length).toBe(1);
      expect(cube.getUncommittedEvents()[0].eventName).toBe('CubeCreated');

      // Build Cube
      cube.build(150, 45.0);
      expect(cube.getStatus()).toBe(CubeStatus.READY);
      expect(cube.getRecordCount()).toBe(150);

      // Refresh Cube
      cube.refresh(50, 20.0);
      expect(cube.getRecordCount()).toBe(200);

      // Deprecate & Archive
      cube.deprecate();
      expect(cube.getStatus()).toBe(CubeStatus.DEPRECATED);

      cube.archive();
      expect(cube.getStatus()).toBe(CubeStatus.ARCHIVED);
    });
  });

  describe('BI Platform Services & Multidimensional Query Execution', () => {
    let repository: InMemoryBiRepository;
    let eventPublisher: NestEventPublisherAdapter;
    let semanticService: SemanticModelService;
    let cubeService: CubeService;
    let queryService: AnalyticalQueryService;
    let drillService: DrillService;
    let dimensionService: BiDimensionService;
    let biPlatformService: EnterpriseBiPlatformService;

    beforeEach(() => {
      repository = new InMemoryBiRepository();
      eventPublisher = new NestEventPublisherAdapter();

      semanticService = new SemanticModelService(repository);
      cubeService = new CubeService(repository, repository, eventPublisher);
      queryService = new AnalyticalQueryService(repository, repository);
      drillService = new DrillService(repository);
      dimensionService = new BiDimensionService();

      biPlatformService = new EnterpriseBiPlatformService(
        repository,
        eventPublisher,
        semanticService,
        cubeService,
        queryService,
        drillService,
        dimensionService
      );
    });

    it('should create an OLAP cube and query multidimensional aggregations', async () => {
      // 1. Create Cube
      const cubeResponse = await biPlatformService.createCube('tenant-bi-100', {
        name: 'Executive Performance Cube',
        analysisType: AnalysisType.EXECUTIVE,
        dimensions: [
          { type: DimensionType.TIME, name: 'Time', hierarchies: ['Year', 'Month'] },
          { type: DimensionType.RESTAURANT, name: 'Restaurant', hierarchies: ['StoreId'] },
        ],
        measures: [
          { type: MeasureType.REVENUE, name: 'Revenue', unit: 'USD', aggregationFormula: 'SUM' },
          { type: MeasureType.ORDERS, name: 'Orders', unit: 'Count', aggregationFormula: 'COUNT' },
        ],
        granularity: AggregationLevel.DAY,
      });

      expect(cubeResponse.id).toBeDefined();
      expect(cubeResponse.status).toBe(CubeStatus.READY);

      // 2. Execute Analytical Query
      const queryResult = await biPlatformService.executeQuery('tenant-bi-100', {
        cubeId: cubeResponse.id,
        analysisType: AnalysisType.EXECUTIVE,
        selectedDimensions: [DimensionType.TIME, DimensionType.RESTAURANT],
        selectedMeasures: [MeasureType.REVENUE, MeasureType.ORDERS],
      });

      expect(queryResult.cubeId).toBe(cubeResponse.id);
      expect(queryResult.rows.length).toBeGreaterThan(0);
      expect(queryResult.executionLatencyMs).toBeGreaterThanOrEqual(0);
    });

    it('should execute Drill Operations (DrillDown / Slice & Dice / Pivot)', async () => {
      const cube = await biPlatformService.createCube('tenant-bi-200', {
        name: 'Inventory & Cost Cube',
        analysisType: AnalysisType.INVENTORY,
        dimensions: [
          { type: DimensionType.PRODUCT, name: 'Product', hierarchies: ['Category', 'ItemId'] },
          { type: DimensionType.SUPPLIER, name: 'Supplier', hierarchies: ['SupplierId'] },
        ],
        measures: [
          { type: MeasureType.INVENTORY_VALUE, name: 'Inventory Value', unit: 'USD', aggregationFormula: 'SUM' },
          { type: MeasureType.COST, name: 'Cost', unit: 'USD', aggregationFormula: 'SUM' },
        ],
      });

      // Execute Drill Down Query
      const drillResult = await biPlatformService.executeQuery('tenant-bi-200', {
        cubeId: cube.id,
        analysisType: AnalysisType.INVENTORY,
        selectedDimensions: [DimensionType.PRODUCT],
        selectedMeasures: [MeasureType.INVENTORY_VALUE],
        drillMode: DrillMode.DRILL_DOWN,
        drillTargetDimension: DimensionType.PRODUCT,
      });

      expect(drillResult.rows.length).toBeGreaterThan(0);
    });

    it('should enforce Tenant Row-Level Security (RLS) isolation', async () => {
      const cube = await biPlatformService.createCube('tenant-alpha', {
        name: 'Alpha Tenant Sales',
        analysisType: AnalysisType.SALES,
        dimensions: [{ type: DimensionType.RESTAURANT, name: 'Restaurant', hierarchies: ['StoreId'] }],
        measures: [{ type: MeasureType.REVENUE, name: 'Revenue', unit: 'USD', aggregationFormula: 'SUM' }],
      });

      // Attempting to query Alpha tenant cube from Beta tenant should be blocked
      await expect(
        biPlatformService.executeQuery('tenant-beta', {
          cubeId: cube.id,
          selectedDimensions: [DimensionType.RESTAURANT],
          selectedMeasures: [MeasureType.REVENUE],
        })
      ).rejects.toThrow(UnauthorizedAnalyticalAccessException);
    });

    it('should query Dimension & Measure catalogs, history, and statistics read models', async () => {
      const dimCatalog = biPlatformService.getDimensionCatalog();
      expect(dimCatalog.dimensions.length).toBe(10); // 10 Dimensions

      const measCatalog = biPlatformService.getMeasureCatalog();
      expect(measCatalog.measures.length).toBe(8); // 8 Measures

      const cube = await biPlatformService.createCube('tenant-stats-1', {
        name: 'Operational Cube',
        analysisType: AnalysisType.OPERATIONAL,
        dimensions: [{ type: DimensionType.DEPARTMENT, name: 'Department', hierarchies: ['DeptId'] }],
        measures: [{ type: MeasureType.EMPLOYEE_HOURS, name: 'Employee Hours', unit: 'Hours', aggregationFormula: 'SUM' }],
      });

      await biPlatformService.executeQuery('tenant-stats-1', {
        cubeId: cube.id,
        selectedDimensions: [DimensionType.DEPARTMENT],
        selectedMeasures: [MeasureType.EMPLOYEE_HOURS],
      });

      const history = await biPlatformService.getAnalyticalHistory('tenant-stats-1');
      expect(history.totalQueriesExecuted).toBe(1);

      const stats = await biPlatformService.getCubeStatistics('tenant-stats-1');
      expect(stats.totalCubes).toBe(1);
    });
  });
});
