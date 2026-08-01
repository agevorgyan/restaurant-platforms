/**
 * Enterprise Business Intelligence Platform - Domain Value Objects
 *
 * Implements immutable Value Objects with domain validation:
 * BusinessDimensionId, BusinessMeasureId, CubeId, CubeDefinition,
 * AnalyticalQuery, DrillPath, FilterSet, SemanticModel, ReportContext.
 */

import { AnalysisType, DimensionType, MeasureType, DrillMode, AggregationLevel } from '../enums/bi.enums';
import { InvalidDimensionException, InvalidMeasureException } from '../exceptions/bi.exceptions';

export class BusinessDimensionId {
  private constructor(private readonly value: string) {}

  public static create(id?: string): BusinessDimensionId {
    const val = id && id.trim() ? id.trim() : `dim-${Math.random().toString(36).substring(2, 9)}`;
    return new BusinessDimensionId(val);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: BusinessDimensionId): boolean {
    return this.value === other.getValue();
  }
}

export class BusinessMeasureId {
  private constructor(private readonly value: string) {}

  public static create(id?: string): BusinessMeasureId {
    const val = id && id.trim() ? id.trim() : `meas-${Math.random().toString(36).substring(2, 9)}`;
    return new BusinessMeasureId(val);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: BusinessMeasureId): boolean {
    return this.value === other.getValue();
  }
}

export class CubeId {
  private constructor(private readonly value: string) {}

  public static create(id?: string): CubeId {
    const val = id && id.trim() ? id.trim() : `cube-${Math.random().toString(36).substring(2, 9)}`;
    return new CubeId(val);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: CubeId): boolean {
    return this.value === other.getValue();
  }
}

export interface DimensionMapping {
  type: DimensionType;
  name: string;
  hierarchies: string[];
}

export interface MeasureMapping {
  type: MeasureType;
  name: string;
  unit: string;
  aggregationFormula: string;
}

export class CubeDefinition {
  private constructor(
    public readonly name: string,
    public readonly analysisType: AnalysisType,
    public readonly dimensions: DimensionMapping[],
    public readonly measures: MeasureMapping[],
    public readonly granularity: AggregationLevel,
    public readonly tenantId: string
  ) {}

  public static create(params: {
    name: string;
    analysisType: AnalysisType;
    dimensions: DimensionMapping[];
    measures: MeasureMapping[];
    granularity?: AggregationLevel;
    tenantId: string;
  }): CubeDefinition {
    if (!params.name || !params.name.trim()) {
      throw new Error('Cube definition name is required');
    }
    if (!params.tenantId || !params.tenantId.trim()) {
      throw new Error('Tenant ID is required for multi-tenant analytical isolated cubes');
    }
    if (!params.dimensions || params.dimensions.length === 0) {
      throw new InvalidDimensionException('At least one dimension must be specified for OLAP cube');
    }
    if (!params.measures || params.measures.length === 0) {
      throw new InvalidMeasureException('At least one measure must be specified for OLAP cube');
    }

    return new CubeDefinition(
      params.name.trim(),
      params.analysisType,
      params.dimensions,
      params.measures,
      params.granularity || AggregationLevel.DAY,
      params.tenantId.trim()
    );
  }
}

export class FilterSet {
  private constructor(
    public readonly dimensionFilters: Record<string, string | string[]>,
    public readonly startDate?: Date,
    public readonly endDate?: Date,
    public readonly searchKeywords?: string[]
  ) {}

  public static create(filters: {
    dimensionFilters?: Record<string, string | string[]>;
    startDate?: Date;
    endDate?: Date;
    searchKeywords?: string[];
  }): FilterSet {
    return new FilterSet(
      filters.dimensionFilters || {},
      filters.startDate,
      filters.endDate,
      filters.searchKeywords || []
    );
  }

  public static empty(): FilterSet {
    return new FilterSet({}, undefined, undefined, []);
  }
}

export class DrillPath {
  private constructor(
    public readonly mode: DrillMode,
    public readonly targetDimension?: DimensionType,
    public readonly sourceLevel?: string,
    public readonly targetLevel?: string,
    public readonly sliceConditions?: Record<string, string>
  ) {}

  public static create(params: {
    mode: DrillMode;
    targetDimension?: DimensionType;
    sourceLevel?: string;
    targetLevel?: string;
    sliceConditions?: Record<string, string>;
  }): DrillPath {
    return new DrillPath(
      params.mode,
      params.targetDimension,
      params.sourceLevel,
      params.targetLevel,
      params.sliceConditions || {}
    );
  }
}

export class AnalyticalQuery {
  private constructor(
    public readonly cubeId: string,
    public readonly analysisType: AnalysisType,
    public readonly selectedDimensions: DimensionType[],
    public readonly selectedMeasures: MeasureType[],
    public readonly filterSet: FilterSet,
    public readonly drillPath?: DrillPath,
    public readonly aggregationLevel: AggregationLevel = AggregationLevel.DAY
  ) {}

  public static create(params: {
    cubeId: string;
    analysisType: AnalysisType;
    selectedDimensions: DimensionType[];
    selectedMeasures: MeasureType[];
    filterSet?: FilterSet;
    drillPath?: DrillPath;
    aggregationLevel?: AggregationLevel;
  }): AnalyticalQuery {
    if (!params.cubeId) {
      throw new Error('AnalyticalQuery requires a valid cubeId');
    }
    if (!params.selectedDimensions || params.selectedDimensions.length === 0) {
      throw new InvalidDimensionException('Analytical query must contain at least one dimension');
    }
    if (!params.selectedMeasures || params.selectedMeasures.length === 0) {
      throw new InvalidMeasureException('Analytical query must contain at least one measure');
    }

    return new AnalyticalQuery(
      params.cubeId,
      params.analysisType,
      params.selectedDimensions,
      params.selectedMeasures,
      params.filterSet || FilterSet.empty(),
      params.drillPath,
      params.aggregationLevel || AggregationLevel.DAY
    );
  }
}

export class SemanticModel {
  private constructor(
    public readonly modelId: string,
    public readonly name: string,
    public readonly analysisType: AnalysisType,
    public readonly dimensionCatalog: DimensionMapping[],
    public readonly measureCatalog: MeasureMapping[],
    public readonly businessRules: string[],
    public readonly version: string
  ) {}

  public static create(params: {
    modelId?: string;
    name: string;
    analysisType: AnalysisType;
    dimensionCatalog: DimensionMapping[];
    measureCatalog: MeasureMapping[];
    businessRules?: string[];
    version?: string;
  }): SemanticModel {
    const id = params.modelId || `sem-${Math.random().toString(36).substring(2, 9)}`;
    return new SemanticModel(
      id,
      params.name,
      params.analysisType,
      params.dimensionCatalog,
      params.measureCatalog,
      params.businessRules || [],
      params.version || '1.0.0'
    );
  }
}

export class ReportContext {
  private constructor(
    public readonly tenantId: string,
    public readonly requestedBy: string,
    public readonly userRoles: string[],
    public readonly timezone: string,
    public readonly requestId: string
  ) {}

  public static create(params: {
    tenantId: string;
    requestedBy: string;
    userRoles?: string[];
    timezone?: string;
    requestId?: string;
  }): ReportContext {
    return new ReportContext(
      params.tenantId,
      params.requestedBy,
      params.userRoles || ['ANALYST'],
      params.timezone || 'UTC',
      params.requestId || `req-${Math.random().toString(36).substring(2, 9)}`
    );
  }
}
