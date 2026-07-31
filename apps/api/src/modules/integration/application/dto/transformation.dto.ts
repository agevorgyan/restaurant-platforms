/**
 * Enterprise Data Transformation Platform - Application DTOs
 */

import { TransformationType, MappingType, TransformationStatus } from '../../domain/enums/transformation.enums';

export interface CreateMappingRuleDto {
  sourcePath: string;
  targetPath: string;
  mappingType?: MappingType;
  expression?: string;
  lookupTable?: Record<string, string>;
  condition?: string;
  defaultValue?: unknown;
}

export interface CreateTransformationDto {
  name: string;
  type?: TransformationType;
  version?: string;
  description?: string;
  rules: CreateMappingRuleDto[];
}

export interface UpdateTransformationDto {
  description?: string;
  rules?: CreateMappingRuleDto[];
}

export interface ExecuteTransformationDto {
  transformationId: string;
  inputPayload: Record<string, unknown>;
  variables?: Record<string, unknown>;
}

export interface CreateSchemaDto {
  name: string;
  version?: string;
  jsonSchema: Record<string, unknown>;
}

export interface TransformationResponseDto {
  id: string;
  tenantId: string;
  name: string;
  type: TransformationType;
  version: string;
  status: TransformationStatus;
  description: string;
  rulesCount: number;
  createdAt: Date;
  updatedAt: Date;
}
