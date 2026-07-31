/**
 * Enterprise Data Transformation Platform - Hexagonal Domain Ports
 */

import { TransformationAggregate } from '../models/transformation.aggregate';
import { TransformationId, SchemaDefinition } from '../value-objects/transformation-vo';

export interface TransformationRepositoryPort {
  save(transformation: TransformationAggregate): Promise<void>;
  findById(id: TransformationId, tenantId?: string): Promise<TransformationAggregate | null>;
  findCatalog(filters?: {
    tenantId?: string;
    type?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<TransformationAggregate[]>;
}

export interface SchemaRepositoryPort {
  saveSchema(schema: SchemaDefinition, tenantId?: string): Promise<void>;
  findSchema(name: string, version?: string, tenantId?: string): Promise<SchemaDefinition | null>;
  getAllSchemas(tenantId?: string): Promise<SchemaDefinition[]>;
}

export interface ExpressionEnginePort {
  evaluateExpression(expression: string, contextData: Record<string, unknown>): unknown;
}
