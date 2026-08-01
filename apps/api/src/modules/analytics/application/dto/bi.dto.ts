/**
 * Enterprise Business Intelligence Platform - Application DTOs
 */

import { IsString, IsNotEmpty, IsEnum, IsArray, ValidateNested, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { AnalysisType, DimensionType, MeasureType, AggregationLevel, DrillMode, CubeStatus } from '../../domain/enums/bi.enums';

export class DimensionMappingDto {
  @IsEnum(DimensionType)
  @IsNotEmpty()
  type!: DimensionType;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  @IsString({ each: true })
  hierarchies!: string[];
}

export class MeasureMappingDto {
  @IsEnum(MeasureType)
  @IsNotEmpty()
  type!: MeasureType;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  unit!: string;

  @IsString()
  @IsNotEmpty()
  aggregationFormula!: string;
}

export class CreateCubeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(AnalysisType)
  @IsNotEmpty()
  analysisType!: AnalysisType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DimensionMappingDto)
  dimensions!: DimensionMappingDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MeasureMappingDto)
  measures!: MeasureMappingDto[];

  @IsEnum(AggregationLevel)
  @IsOptional()
  granularity?: AggregationLevel;
}

export class ExecuteBiQueryDto {
  @IsString()
  @IsNotEmpty()
  cubeId!: string;

  @IsEnum(AnalysisType)
  @IsOptional()
  analysisType?: AnalysisType;

  @IsArray()
  @IsEnum(DimensionType, { each: true })
  selectedDimensions!: DimensionType[];

  @IsArray()
  @IsEnum(MeasureType, { each: true })
  selectedMeasures!: MeasureType[];

  @IsOptional()
  dimensionFilters?: Record<string, string | string[]>;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(AggregationLevel)
  @IsOptional()
  aggregationLevel?: AggregationLevel;

  @IsEnum(DrillMode)
  @IsOptional()
  drillMode?: DrillMode;

  @IsEnum(DimensionType)
  @IsOptional()
  drillTargetDimension?: DimensionType;

  @IsOptional()
  sliceConditions?: Record<string, string>;
}

export class CubeResponseDto {
  id!: string;
  tenantId!: string;
  name!: string;
  analysisType!: AnalysisType;
  dimensions!: DimensionMappingDto[];
  measures!: MeasureMappingDto[];
  status!: CubeStatus;
  granularity!: AggregationLevel;
  recordCount!: number;
  createdAt!: Date;
  updatedAt!: Date;
  lastRefreshedAt?: Date;
}

export class BiQueryResultDto {
  cubeId!: string;
  analysisType!: AnalysisType;
  selectedDimensions!: string[];
  selectedMeasures!: string[];
  rows!: Array<{
    dimensions: Record<string, string>;
    measures: Record<string, number>;
    aggregationLevel?: string;
  }>;
  totalRecords!: number;
  executionLatencyMs!: number;
  cacheHit!: boolean;
}
