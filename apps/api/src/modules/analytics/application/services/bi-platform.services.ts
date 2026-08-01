/**
 * Enterprise Business Intelligence Platform - Domain & Application Services
 *
 * Implements core services:
 * 1. SemanticModelService
 * 2. CubeService
 * 3. AnalyticalQueryService
 * 4. DrillService
 * 5. BiAggregationService
 * 6. BiDimensionService
 * 7. EnterpriseBiPlatformService (Facade orchestrating DDD domain services)
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { CubeAggregate } from '../../domain/models/cube.aggregate';
import {
  AnalyticalQuery,
  FilterSet,
  DrillPath,
  SemanticModel,
  ReportContext,
} from '../../domain/value-objects/bi-vo';
import {
  AnalysisType,
  DimensionType,
  MeasureType,
  DrillMode,
  CubeStatus,
  AggregationLevel,
} from '../../domain/enums/bi.enums';
import {
  BiRepositoryPort,
  OlapEnginePort,
  BiQueryResult,
} from '../../domain/ports/bi.ports';
import { EVENT_PUBLISHER_TOKEN } from '../../../integration/application/services/connector-platform.services';
import { EventPublisherPort } from '../../../integration/domain/ports/connector.ports';
import { CreateCubeDto, ExecuteBiQueryDto, CubeResponseDto, BiQueryResultDto } from '../dto/bi.dto';
import {
  BusinessCubesReadModel,
  DimensionCatalogReadModel,
  MeasureCatalogReadModel,
  AnalyticalHistoryReadModel,
  CubeStatisticsReadModel,
  QueryPerformanceReadModel,
} from '../read-models/bi.read-models';
import { AnalyticalQueryExecutedEvent } from '../../domain/events/bi.events';
import { CubeNotFoundException, UnauthorizedAnalyticalAccessException, SemanticConsistencyException } from '../../domain/exceptions/bi.exceptions';

export const BI_REPOSITORY_TOKEN = 'BiRepositoryPort';
export const OLAP_ENGINE_TOKEN = 'OlapEnginePort';

/**
 * Service 1: SemanticModelService
 * Validates, maintains, and enforces consistency of semantic business models.
 */
@Injectable()
export class SemanticModelService {
  private readonly logger = new Logger(SemanticModelService.name);

  constructor(
    @Inject(BI_REPOSITORY_TOKEN)
    private readonly repo: BiRepositoryPort
  ) {}

  public validateConsistency(model: SemanticModel): boolean {
    if (!model.name || !model.name.trim()) {
      throw new SemanticConsistencyException('Semantic model name cannot be empty');
    }
    if (model.dimensionCatalog.length === 0) {
      throw new SemanticConsistencyException('Semantic model must define at least one dimension');
    }
    if (model.measureCatalog.length === 0) {
      throw new SemanticConsistencyException('Semantic model must define at least one measure');
    }
    return true;
  }

  public async registerSemanticModel(model: SemanticModel): Promise<SemanticModel> {
    this.validateConsistency(model);
    await this.repo.saveSemanticModel(model);
    return model;
  }

  public async getSemanticModel(modelId: string): Promise<SemanticModel | null> {
    return this.repo.findSemanticModelById(modelId);
  }
}

/**
 * Service 2: CubeService
 * Manages the complete lifecycle of OLAP Cubes (Creation, Building, Refreshing, Archiving).
 */
@Injectable()
export class CubeService {
  private readonly logger = new Logger(CubeService.name);

  constructor(
    @Inject(BI_REPOSITORY_TOKEN)
    private readonly repo: BiRepositoryPort,
    @Inject(OLAP_ENGINE_TOKEN)
    private readonly olapEngine: OlapEnginePort,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort
  ) {}

  public async createCube(tenantId: string, dto: CreateCubeDto): Promise<CubeAggregate> {
    const cube = CubeAggregate.create({
      name: dto.name,
      analysisType: dto.analysisType,
      dimensions: dto.dimensions,
      measures: dto.measures,
      granularity: dto.granularity || AggregationLevel.DAY,
      tenantId,
    });

    const startMs = Date.now();
    const materializedCount = await this.olapEngine.materializeAggregates(cube);
    const durationMs = Date.now() - startMs;

    cube.build(materializedCount, durationMs);

    await this.repo.saveCube(cube);
    await this.eventPublisher.publishAll(cube.getUncommittedEvents());
    cube.clearEvents();

    return cube;
  }

  public async refreshCube(tenantId: string, cubeId: string): Promise<CubeAggregate> {
    const cube = await this.repo.findCubeById(cubeId);
    if (!cube) {
      throw new CubeNotFoundException(cubeId);
    }
    if (cube.getTenantId() !== tenantId) {
      throw new UnauthorizedAnalyticalAccessException(tenantId, `Cube:${cubeId}`);
    }

    const startMs = Date.now();
    const refreshedCount = await this.olapEngine.materializeAggregates(cube);
    const durationMs = Date.now() - startMs;

    cube.refresh(refreshedCount, durationMs);

    await this.repo.saveCube(cube);
    await this.eventPublisher.publishAll(cube.getUncommittedEvents());
    cube.clearEvents();

    return cube;
  }
}

/**
 * Service 3: AnalyticalQueryService
 * Executes analytical queries, applying Tenant Row-Level Security (RLS) & Semantic Model Resolution.
 */
@Injectable()
export class AnalyticalQueryService {
  constructor(
    @Inject(BI_REPOSITORY_TOKEN)
    private readonly repo: BiRepositoryPort,
    @Inject(OLAP_ENGINE_TOKEN)
    private readonly olapEngine: OlapEnginePort
  ) {}

  public async executeQuery(tenantId: string, query: AnalyticalQuery): Promise<BiQueryResult> {
    const cube = await this.repo.findCubeById(query.cubeId);
    if (!cube) {
      throw new CubeNotFoundException(query.cubeId);
    }

    // Row-level Security (RLS) Tenant Validation
    if (cube.getTenantId() !== tenantId) {
      throw new UnauthorizedAnalyticalAccessException(tenantId, `Cube:${query.cubeId}`);
    }

    const startMs = Date.now();
    const result = await this.olapEngine.executeAnalyticalQuery(tenantId, query);
    const durationMs = Date.now() - startMs;

    // Log Query Execution for audit and immutable history
    await this.repo.logQueryExecution({
      tenantId,
      cubeId: query.cubeId,
      analysisType: query.analysisType,
      latencyMs: durationMs,
      resultCount: result.totalRecords,
      drillMode: query.drillPath?.mode,
      executedAt: new Date(),
    });

    return result;
  }
}

/**
 * Service 4: DrillService
 * Executes Multidimensional Drill operations: DrillDown, DrillUp, DrillThrough, Slice, Dice, Pivot.
 */
@Injectable()
export class DrillService {
  constructor(
    @Inject(OLAP_ENGINE_TOKEN)
    private readonly olapEngine: OlapEnginePort
  ) {}

  public async executeDrill(
    tenantId: string,
    cubeId: string,
    drillPath: DrillPath,
    filterSet?: FilterSet
  ): Promise<BiQueryResult> {
    return this.olapEngine.executeDrillQuery(tenantId, cubeId, drillPath, filterSet);
  }
}

/**
 * Service 5: BiAggregationService
 * Performs multidimensional aggregations and calculations.
 */
@Injectable()
export class BiAggregationService {
  public aggregate(values: number[], formula: string): number {
    if (values.length === 0) return 0;
    const cleanFormula = formula.toUpperCase();

    if (cleanFormula.includes('AVERAGE') || cleanFormula.includes('AVG')) {
      return values.reduce((a, b) => a + b, 0) / values.length;
    }
    if (cleanFormula.includes('COUNT')) {
      return values.length;
    }
    if (cleanFormula.includes('MIN')) {
      return Math.min(...values);
    }
    if (cleanFormula.includes('MAX')) {
      return Math.max(...values);
    }
    // Default SUM
    return values.reduce((a, b) => a + b, 0);
  }
}

/**
 * Service 6: BiDimensionService
 * Manages dimension hierarchies, dimension catalogs, and measure catalogs.
 */
@Injectable()
export class BiDimensionService {
  public getSupportedDimensions(): DimensionCatalogReadModel {
    const dimensions = [
      { type: DimensionType.TIME, name: 'Time', description: 'Temporal hierarchy', hierarchies: ['Year', 'Quarter', 'Month', 'Day', 'Hour'], sampleValues: ['2026-08-01', '2026-Q3'] },
      { type: DimensionType.RESTAURANT, name: 'Restaurant', description: 'Restaurant branch entity', hierarchies: ['Brand', 'Location', 'StoreId'], sampleValues: ['Downtown Bistro', 'Airport Branch'] },
      { type: DimensionType.REGION, name: 'Region', description: 'Geographic territory', hierarchies: ['Country', 'State', 'City', 'ZipCode'], sampleValues: ['North America', 'California', 'San Francisco'] },
      { type: DimensionType.DEPARTMENT, name: 'Department', description: 'Organizational unit', hierarchies: ['Division', 'Department'], sampleValues: ['Kitchen', 'Front of House', 'Management'] },
      { type: DimensionType.EMPLOYEE, name: 'Employee', description: 'Staff member', hierarchies: ['Role', 'EmployeeId'], sampleValues: ['Head Chef', 'Shift Manager'] },
      { type: DimensionType.CUSTOMER, name: 'Customer', description: 'Guest / Loyalty member', hierarchies: ['Tier', 'CustomerId'], sampleValues: ['VIP Gold', 'Standard'] },
      { type: DimensionType.PRODUCT, name: 'Product', description: 'Menu item', hierarchies: ['Category', 'SubCategory', 'ItemId'], sampleValues: ['Burgers', 'Craft Beer'] },
      { type: DimensionType.SUPPLIER, name: 'Supplier', description: 'Vendor / Inventory supplier', hierarchies: ['Category', 'SupplierId'], sampleValues: ['Fresh Produce Co', 'Quality Meats'] },
      { type: DimensionType.CHANNEL, name: 'Channel', description: 'Sales order channel', hierarchies: ['ChannelGroup', 'ChannelId'], sampleValues: ['Dine-In', 'Takeout', 'UberEats'] },
      { type: DimensionType.PROMOTION, name: 'Promotion', description: 'Marketing campaign', hierarchies: ['Campaign', 'PromoCode'], sampleValues: ['Summer Discount', 'Loyalty Reward'] },
    ];

    return {
      totalDimensions: dimensions.length,
      dimensions,
    };
  }

  public getSupportedMeasures(): MeasureCatalogReadModel {
    const measures = [
      { type: MeasureType.REVENUE, name: 'Revenue', description: 'Gross revenue monetary amount', unit: 'USD', defaultAggregation: 'SUM' },
      { type: MeasureType.ORDERS, name: 'Orders', description: 'Total fulfilled order count', unit: 'Count', defaultAggregation: 'COUNT' },
      { type: MeasureType.PROFIT, name: 'Profit', description: 'Net profit monetary amount', unit: 'USD', defaultAggregation: 'SUM' },
      { type: MeasureType.COST, name: 'Cost', description: 'Total operational & ingredient cost', unit: 'USD', defaultAggregation: 'SUM' },
      { type: MeasureType.MARGIN, name: 'Margin', description: 'Profit margin percentage', unit: 'Percentage', defaultAggregation: 'AVG' },
      { type: MeasureType.INVENTORY_VALUE, name: 'Inventory Value', description: 'Current stock inventory valuation', unit: 'USD', defaultAggregation: 'SUM' },
      { type: MeasureType.CUSTOMER_COUNT, name: 'Customer Count', description: 'Unique customer count', unit: 'Count', defaultAggregation: 'COUNT' },
      { type: MeasureType.EMPLOYEE_HOURS, name: 'Employee Hours', description: 'Total staff labor hours worked', unit: 'Hours', defaultAggregation: 'SUM' },
    ];

    return {
      totalMeasures: measures.length,
      measures,
    };
  }
}

/**
 * Service 7: EnterpriseBiPlatformService
 * High-level BI Platform Facade integrating all domain services, RLS, auditing, and observability.
 */
@Injectable()
export class EnterpriseBiPlatformService {
  private readonly logger = new Logger(EnterpriseBiPlatformService.name);

  constructor(
    @Inject(BI_REPOSITORY_TOKEN)
    private readonly repo: BiRepositoryPort,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort,
    private readonly semanticModelService: SemanticModelService,
    private readonly cubeService: CubeService,
    private readonly queryService: AnalyticalQueryService,
    private readonly drillService: DrillService,
    private readonly dimensionService: BiDimensionService
  ) {}

  public async createCube(tenantId: string, dto: CreateCubeDto): Promise<CubeResponseDto> {
    const cube = await this.cubeService.createCube(tenantId, dto);
    return this.toCubeResponseDto(cube);
  }

  public async getCubes(tenantId: string, analysisType?: AnalysisType, status?: CubeStatus): Promise<BusinessCubesReadModel> {
    const cubes = await this.repo.findCubes(tenantId, analysisType, status);
    const summaries = cubes.map(c => ({
      cubeId: c.getId().getValue(),
      tenantId: c.getTenantId(),
      name: c.getDefinition().name,
      analysisType: c.getDefinition().analysisType,
      status: c.getStatus(),
      granularity: c.getDefinition().granularity,
      dimensionTypes: c.getDefinition().dimensions.map(d => d.type),
      measureTypes: c.getDefinition().measures.map(m => m.type),
      recordCount: c.getRecordCount(),
      lastRefreshedAt: c.getLastRefreshedAt(),
    }));

    return {
      totalCubes: summaries.length,
      cubes: summaries,
    };
  }

  public async executeQuery(tenantId: string, dto: ExecuteBiQueryDto): Promise<BiQueryResultDto> {
    const filterSet = FilterSet.create({
      dimensionFilters: dto.dimensionFilters,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    });

    const drillPath = dto.drillMode
      ? DrillPath.create({
          mode: dto.drillMode,
          targetDimension: dto.drillTargetDimension,
          sliceConditions: dto.sliceConditions,
        })
      : undefined;

    const query = AnalyticalQuery.create({
      cubeId: dto.cubeId,
      analysisType: dto.analysisType || AnalysisType.OPERATIONAL,
      selectedDimensions: dto.selectedDimensions,
      selectedMeasures: dto.selectedMeasures,
      filterSet,
      drillPath,
      aggregationLevel: dto.aggregationLevel || AggregationLevel.DAY,
    });

    const result = await this.queryService.executeQuery(tenantId, query);

    await this.eventPublisher.publish(
      new AnalyticalQueryExecutedEvent(
        'bi-query-agg',
        tenantId,
        dto.cubeId,
        query.analysisType,
        dto.drillMode || 'STANDARD',
        result.totalRecords,
        result.executionLatencyMs
      )
    );

    return {
      cubeId: result.cubeId,
      analysisType: result.analysisType,
      selectedDimensions: result.selectedDimensions,
      selectedMeasures: result.selectedMeasures,
      rows: result.rows,
      totalRecords: result.totalRecords,
      executionLatencyMs: result.executionLatencyMs,
      cacheHit: result.cacheHit,
    };
  }

  public async getAnalyticalHistory(tenantId: string, limit?: number): Promise<AnalyticalHistoryReadModel> {
    const history = await this.repo.getAnalyticalHistory(tenantId, limit);
    return {
      tenantId,
      totalQueriesExecuted: history.length,
      history: history.map(h => ({
        queryId: h.queryId || `q-${Math.random().toString(36).substring(2, 7)}`,
        tenantId: h.tenantId,
        cubeId: h.cubeId,
        analysisType: h.analysisType,
        drillMode: h.drillMode,
        latencyMs: h.latencyMs,
        resultCount: h.resultCount,
        executedAt: h.executedAt,
      })),
    };
  }

  public async getCubeStatistics(tenantId?: string): Promise<CubeStatisticsReadModel> {
    return this.repo.getCubeStatistics(tenantId);
  }

  public getDimensionCatalog(): DimensionCatalogReadModel {
    return this.dimensionService.getSupportedDimensions();
  }

  public getMeasureCatalog(): MeasureCatalogReadModel {
    return this.dimensionService.getSupportedMeasures();
  }

  private toCubeResponseDto(cube: CubeAggregate): CubeResponseDto {
    const def = cube.getDefinition();
    return {
      id: cube.getId().getValue(),
      tenantId: cube.getTenantId(),
      name: def.name,
      analysisType: def.analysisType,
      dimensions: def.dimensions.map(d => ({
        type: d.type,
        name: d.name,
        hierarchies: d.hierarchies,
      })),
      measures: def.measures.map(m => ({
        type: m.type,
        name: m.name,
        unit: m.unit,
        aggregationFormula: m.aggregationFormula,
      })),
      status: cube.getStatus(),
      granularity: def.granularity,
      recordCount: cube.getRecordCount(),
      createdAt: cube.getCreatedAt(),
      updatedAt: cube.getUpdatedAt(),
      lastRefreshedAt: cube.getLastRefreshedAt(),
    };
  }
}
