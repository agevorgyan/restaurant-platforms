/**
 * Enterprise Business Intelligence Platform - Cube Aggregate Root
 *
 * Encapsulates OLAP Cube entity, status transitions, dimension/measure definitions,
 * materialized aggregation tracking, and event emission.
 */

import { CubeId, CubeDefinition, DimensionMapping, MeasureMapping } from '../value-objects/bi-vo';
import { CubeStatus, DimensionType, MeasureType } from '../enums/bi.enums';
import {
  CubeCreatedEvent,
  CubeBuiltEvent,
  CubeRefreshedEvent,
  DimensionUpdatedEvent,
  BiDomainEvent,
} from '../events/bi.events';
import { InvalidDimensionException, InvalidMeasureException } from '../exceptions/bi.exceptions';

export interface CubeCellData {
  dimensions: Record<string, string>;
  measures: Record<string, number>;
  timestamp: Date;
}

export class CubeAggregate {
  private uncommittedEvents: BiDomainEvent[] = [];

  private constructor(
    private readonly id: CubeId,
    private definition: CubeDefinition,
    private status: CubeStatus,
    private recordCount: number,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private lastRefreshedAt?: Date,
    private cells: CubeCellData[] = []
  ) {}

  public static create(params: {
    id?: string;
    name: string;
    analysisType: any;
    dimensions: DimensionMapping[];
    measures: MeasureMapping[];
    granularity?: any;
    tenantId: string;
  }): CubeAggregate {
    const cubeId = CubeId.create(params.id);
    const definition = CubeDefinition.create({
      name: params.name,
      analysisType: params.analysisType,
      dimensions: params.dimensions,
      measures: params.measures,
      granularity: params.granularity,
      tenantId: params.tenantId,
    });

    const now = new Date();
    const aggregate = new CubeAggregate(
      cubeId,
      definition,
      CubeStatus.DRAFT,
      0,
      now,
      now
    );

    aggregate.recordEvent(
      new CubeCreatedEvent(
        cubeId.getValue(),
        params.tenantId,
        definition.name,
        definition.analysisType,
        now
      )
    );

    return aggregate;
  }

  public build(recordCount: number, durationMs: number, initialCells: CubeCellData[] = []): void {
    if (this.status === CubeStatus.ARCHIVED) {
      throw new Error(`Cannot build archived OLAP cube '${this.id.getValue()}'`);
    }

    this.status = CubeStatus.BUILDING;
    this.recordCount = recordCount;
    this.cells = initialCells;
    this.status = CubeStatus.READY;
    this.updatedAt = new Date();
    this.lastRefreshedAt = new Date();

    this.recordEvent(
      new CubeBuiltEvent(
        this.id.getValue(),
        this.definition.tenantId,
        this.definition.dimensions.length,
        this.definition.measures.length,
        recordCount,
        durationMs,
        this.updatedAt
      )
    );
  }

  public refresh(additionalRecordCount: number, durationMs: number, newCells?: CubeCellData[]): void {
    if (this.status !== CubeStatus.READY) {
      throw new Error(`Cube must be in READY status to refresh. Current status: ${this.status}`);
    }

    this.recordCount += additionalRecordCount;
    if (newCells && newCells.length > 0) {
      this.cells = [...this.cells, ...newCells];
    }
    this.lastRefreshedAt = new Date();
    this.updatedAt = new Date();

    this.recordEvent(
      new CubeRefreshedEvent(
        this.id.getValue(),
        this.definition.tenantId,
        this.recordCount,
        durationMs,
        this.updatedAt
      )
    );
  }

  public deprecate(): void {
    this.status = CubeStatus.DEPRECATED;
    this.updatedAt = new Date();
  }

  public archive(): void {
    this.status = CubeStatus.ARCHIVED;
    this.updatedAt = new Date();
  }

  public addDimension(dimension: DimensionMapping): void {
    const exists = this.definition.dimensions.some(d => d.type === dimension.type);
    if (exists) {
      throw new InvalidDimensionException(`Dimension '${dimension.type}' already exists in cube definition`);
    }

    this.definition.dimensions.push(dimension);
    this.updatedAt = new Date();

    this.recordEvent(
      new DimensionUpdatedEvent(
        this.id.getValue(),
        this.definition.tenantId,
        dimension.type,
        'ADDED',
        this.updatedAt
      )
    );
  }

  public addMeasure(measure: MeasureMapping): void {
    const exists = this.definition.measures.some(m => m.type === measure.type);
    if (exists) {
      throw new InvalidMeasureException(`Measure '${measure.type}' already exists in cube definition`);
    }

    this.definition.measures.push(measure);
    this.updatedAt = new Date();
  }

  // Getters
  public getId(): CubeId {
    return this.id;
  }

  public getDefinition(): CubeDefinition {
    return this.definition;
  }

  public getStatus(): CubeStatus {
    return this.status;
  }

  public getRecordCount(): number {
    return this.recordCount;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getLastRefreshedAt(): Date | undefined {
    return this.lastRefreshedAt;
  }

  public getTenantId(): string {
    return this.definition.tenantId;
  }

  public getCells(): CubeCellData[] {
    return this.cells;
  }

  // Event dispatching
  private recordEvent(event: BiDomainEvent): void {
    this.uncommittedEvents.push(event);
  }

  public getUncommittedEvents(): BiDomainEvent[] {
    return [...this.uncommittedEvents];
  }

  public clearEvents(): void {
    this.uncommittedEvents = [];
  }
}
