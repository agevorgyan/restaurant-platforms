/**
 * Enterprise Data Transformation Platform - Domain & Application Services
 *
 * Implements core application services:
 * 1. TransformationService
 * 2. SchemaValidationService
 * 3. MappingService
 * 4. NormalizationService
 * 5. ExpressionService
 * 6. VersionService
 * 7. TransformationRegistryService
 * 8. TransformationPlatformService (Anti-Corruption Layer facade)
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { TransformationAggregate } from '../../domain/models/transformation.aggregate';
import {
  TransformationId,
  TransformationVersion,
  MappingRule,
  TransformationResult,
  ValidationResult,
  SchemaDefinition,
  TransformationContext,
} from '../../domain/value-objects/transformation-vo';
import {
  TransformationType,
  MappingType,
  MappingResultEnum,
  TransformationStatus,
} from '../../domain/enums/transformation.enums';
import {
  TransformationRepositoryPort,
  SchemaRepositoryPort,
  ExpressionEnginePort,
} from '../../domain/ports/transformation.ports';
import { EVENT_PUBLISHER_TOKEN } from './connector-platform.services';
import { EventPublisherPort } from '../../domain/ports/connector.ports';
import {
  CreateTransformationDto,
  UpdateTransformationDto,
  ExecuteTransformationDto,
  CreateSchemaDto,
  TransformationResponseDto,
  CreateMappingRuleDto,
} from '../dto/transformation.dto';
import {
  TransformationCatalog,
  SchemaRegistry,
  MappingStatistics,
  ValidationResults,
  TransformationHistory,
} from '../read-models/transformation.read-models';
import {
  TransformationNotFoundException,
  MappingExecutionException,
  SchemaValidationException,
} from '../../domain/exceptions/transformation.exceptions';
import { PayloadMappedEvent } from '../../domain/events/transformation.events';

export const TRANSFORMATION_REPOSITORY_TOKEN = 'TransformationRepositoryPort';
export const SCHEMA_REPOSITORY_TOKEN = 'SchemaRepositoryPort';
export const EXPRESSION_ENGINE_TOKEN = 'ExpressionEnginePort';

/**
 * Service 1: SchemaValidationService
 * Validates payloads against JSON Schema definitions.
 */
@Injectable()
export class SchemaValidationService {
  constructor(
    @Inject(SCHEMA_REPOSITORY_TOKEN)
    private readonly schemaRepo: SchemaRepositoryPort
  ) {}

  public async validatePayload(schemaName: string, payload: Record<string, unknown>, version?: string): Promise<ValidationResult> {
    const schema = await this.schemaRepo.findSchema(schemaName, version);
    if (!schema) {
      throw new SchemaValidationException(`Schema '${schemaName}' version '${version || 'latest'}' not registered.`);
    }

    const errors: string[] = [];
    const jsonSchema = schema.jsonSchema;

    if (jsonSchema.required && Array.isArray(jsonSchema.required)) {
      for (const field of jsonSchema.required as string[]) {
        if (payload[field] === undefined || payload[field] === null) {
          errors.push(`Missing mandatory required field '${field}'`);
        }
      }
    }

    return errors.length === 0 ? ValidationResult.valid() : ValidationResult.invalid(errors);
  }
}

/**
 * Service 2: ExpressionService
 * Evaluates deterministic mapping expressions (string manipulation, math, conditions).
 */
@Injectable()
export class ExpressionService {
  constructor(
    @Inject(EXPRESSION_ENGINE_TOKEN)
    private readonly engine: ExpressionEnginePort
  ) {}

  public evaluate(expression: string, contextData: Record<string, unknown>): unknown {
    return this.engine.evaluateExpression(expression, contextData);
  }
}

/**
 * Service 3: NormalizationService
 * Normalizes field values (trimming strings, phone format, upper/lower case).
 */
@Injectable()
export class NormalizationService {
  public normalizeValue(value: unknown, ruleType?: string): unknown {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (ruleType === 'UPPERCASE') return trimmed.toUpperCase();
      if (ruleType === 'LOWERCASE') return trimmed.toLowerCase();
      if (ruleType === 'PHONE_E164') return trimmed.replace(/[^+\d]/g, '');
      return trimmed;
    }
    return value;
  }
}

/**
 * Service 4: MappingService
 * Executes field mapping rules (One-to-One, One-to-Many, Many-to-One, Lookup, Conditional, Expression).
 */
@Injectable()
export class MappingService {
  constructor(
    private readonly expressionService: ExpressionService,
    private readonly normalizationService: NormalizationService
  ) {}

  public executeMapping(
    transformation: TransformationAggregate,
    sourcePayload: Record<string, unknown>,
    context?: TransformationContext
  ): TransformationResult {
    const startTime = Date.now();
    const rules = transformation.getMapping().getRules();
    const output: Record<string, unknown> = {};
    const errors: string[] = [];
    let mappedCount = 0;

    for (const rule of rules) {
      const props = rule.getProps();
      const sourcePath = props.sourceField.getPath();
      const targetPath = props.targetField.getPath();

      try {
        let value: unknown = this.getByPath(sourcePayload, sourcePath);

        // Conditional Check
        if (props.condition) {
          const conditionPassed = Boolean(
            this.expressionService.evaluate(props.condition, { ...sourcePayload, value })
          );
          if (!conditionPassed) continue;
        }

        // Apply Mapping Type Logic
        switch (props.mappingType) {
          case MappingType.ONE_TO_ONE:
            value = value !== undefined ? value : props.defaultValue;
            break;

          case MappingType.EXPRESSION_MAPPING:
            if (props.expression) {
              value = this.expressionService.evaluate(props.expression, { ...sourcePayload, value, vars: context?.variables });
            }
            break;

          case MappingType.LOOKUP_MAPPING:
            if (props.lookupTable && typeof value === 'string') {
              value = props.lookupTable[value] || props.defaultValue || value;
            }
            break;

          case MappingType.ONE_TO_MANY:
            // Output array or split value
            value = Array.isArray(value) ? value : [value];
            break;

          case MappingType.MANY_TO_ONE:
            // Concatenate array or object
            value = Array.isArray(value) ? value.join(' ') : String(value);
            break;

          default:
            value = value !== undefined ? value : props.defaultValue;
            break;
        }

        value = this.normalizationService.normalizeValue(value);

        if (value !== undefined) {
          this.setByPath(output, targetPath, value);
          mappedCount++;
        }
      } catch (err: any) {
        errors.push(`Error mapping field '${sourcePath}' -> '${targetPath}': ${err?.message}`);
      }
    }

    const durationMs = Date.now() - startTime;
    const status = errors.length === 0 ? MappingResultEnum.SUCCESS : mappedCount > 0 ? MappingResultEnum.PARTIAL : MappingResultEnum.FAILED;

    return new TransformationResult(status, output, mappedCount, durationMs, errors);
  }

  private getByPath(obj: Record<string, unknown>, path: string): unknown {
    const parts = path.split('.');
    let current: any = obj;
    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }
    return current;
  }

  private setByPath(obj: Record<string, unknown>, path: string, value: unknown): void {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;
  }
}

/**
 * Service 5: VersionService
 * Manages SemVer schema and transformation versions.
 */
@Injectable()
export class VersionService {
  public validateSemverUpgrade(currentVersion: string, newVersion: string): void {
    const v1 = TransformationVersion.create(currentVersion);
    const v2 = TransformationVersion.create(newVersion);
    if (v2.getValue() === v1.getValue()) {
      throw new MappingExecutionException(`New version '${newVersion}' must differ from current version '${currentVersion}'`);
    }
  }
}

/**
 * Service 6: TransformationRegistryService
 * Maintains transformation catalog and schema registry.
 */
@Injectable()
export class TransformationRegistryService {
  constructor(
    @Inject(TRANSFORMATION_REPOSITORY_TOKEN)
    private readonly repo: TransformationRepositoryPort,
    @Inject(SCHEMA_REPOSITORY_TOKEN)
    private readonly schemaRepo: SchemaRepositoryPort
  ) {}

  public async getCatalog(query?: any): Promise<TransformationCatalog> {
    const list = await this.repo.findCatalog(query);
    const transformations = list.map(t => ({
      id: t.getId().getValue(),
      tenantId: t.getTenantId(),
      name: t.getName(),
      type: t.getType(),
      version: t.getVersion().getValue(),
      status: t.getStatus(),
      description: t.getDescription(),
      rulesCount: t.getMapping().getRules().length,
      createdAt: t.getCreatedAt(),
    }));

    return {
      totalCount: transformations.length,
      transformations,
    };
  }

  public async getSchemaRegistry(tenantId?: string): Promise<SchemaRegistry> {
    const schemas = await this.schemaRepo.getAllSchemas(tenantId);
    const items = schemas.map(s => ({
      name: s.name,
      version: s.version.getValue(),
      jsonSchema: s.jsonSchema,
    }));

    return {
      totalCount: items.length,
      schemas: items,
    };
  }
}

/**
 * Service 7 & 8: TransformationPlatformService (Anti-Corruption Layer Facade)
 * High-level service acting as the Anti-Corruption Layer converting external vendor DTOs
 * into clean, domain-safe internal models.
 */
@Injectable()
export class TransformationPlatformService {
  private readonly logger = new Logger(TransformationPlatformService.name);

  constructor(
    @Inject(TRANSFORMATION_REPOSITORY_TOKEN)
    private readonly repo: TransformationRepositoryPort,
    @Inject(SCHEMA_REPOSITORY_TOKEN)
    private readonly schemaRepo: SchemaRepositoryPort,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort,
    private readonly mappingService: MappingService,
    private readonly schemaValidationService: SchemaValidationService,
    private readonly registryService: TransformationRegistryService
  ) {}

  public async createTransformation(tenantId: string, dto: CreateTransformationDto): Promise<TransformationResponseDto> {
    const rules = (dto.rules || []).map(r => MappingRule.create(r));

    const aggregate = TransformationAggregate.create({
      tenantId,
      name: dto.name,
      type: dto.type,
      version: dto.version,
      description: dto.description,
      rules,
    });

    await this.repo.save(aggregate);
    await this.eventPublisher.publishAll(aggregate.getUncommittedEvents());
    aggregate.clearEvents();

    return this.toResponseDto(aggregate);
  }

  public async updateTransformation(id: string, tenantId: string, dto: UpdateTransformationDto): Promise<TransformationResponseDto> {
    const aggregate = await this.repo.findById(TransformationId.create(id), tenantId);
    if (!aggregate) throw new TransformationNotFoundException(id);

    if (dto.rules) {
      const rules = dto.rules.map(r => MappingRule.create(r));
      aggregate.updateRules(rules); // Throws ImmutableMappingException if PUBLISHED
    }

    await this.repo.save(aggregate);
    await this.eventPublisher.publishAll(aggregate.getUncommittedEvents());
    aggregate.clearEvents();

    return this.toResponseDto(aggregate);
  }

  public async validateTransformation(id: string, tenantId: string): Promise<ValidationResults> {
    const aggregate = await this.repo.findById(TransformationId.create(id), tenantId);
    if (!aggregate) throw new TransformationNotFoundException(id);

    const validation = aggregate.validateTransformation();

    await this.repo.save(aggregate);
    await this.eventPublisher.publishAll(aggregate.getUncommittedEvents());
    aggregate.clearEvents();

    return {
      transformationId: id,
      isValid: validation.isValid,
      ruleCount: aggregate.getMapping().getRules().length,
      errors: validation.errors,
    };
  }

  public async publishTransformation(id: string, tenantId: string): Promise<TransformationResponseDto> {
    const aggregate = await this.repo.findById(TransformationId.create(id), tenantId);
    if (!aggregate) throw new TransformationNotFoundException(id);

    aggregate.publish();

    await this.repo.save(aggregate);
    await this.eventPublisher.publishAll(aggregate.getUncommittedEvents());
    aggregate.clearEvents();

    return this.toResponseDto(aggregate);
  }

  public async executeTransformation(tenantId: string, dto: ExecuteTransformationDto): Promise<TransformationResult> {
    const aggregate = await this.repo.findById(TransformationId.create(dto.transformationId), tenantId);
    if (!aggregate) throw new TransformationNotFoundException(dto.transformationId);

    const context = TransformationContext.create(tenantId, aggregate.getId().getValue(), dto.variables);
    const result = this.mappingService.executeMapping(aggregate, dto.inputPayload, context);

    if (result.isSuccess()) {
      await this.eventPublisher.publish(
        new PayloadMappedEvent(aggregate.getId().getValue(), tenantId, result.fieldsMappedCount, result.durationMs)
      );
    }

    return result;
  }

  public async registerSchema(tenantId: string, dto: CreateSchemaDto): Promise<{ name: string; version: string }> {
    const schema = SchemaDefinition.create(dto.name, dto.jsonSchema, dto.version);
    await this.schemaRepo.saveSchema(schema, tenantId);
    return { name: schema.name, version: schema.version.getValue() };
  }

  public toResponseDto(aggregate: TransformationAggregate): TransformationResponseDto {
    return {
      id: aggregate.getId().getValue(),
      tenantId: aggregate.getTenantId(),
      name: aggregate.getName(),
      type: aggregate.getType(),
      version: aggregate.getVersion().getValue(),
      status: aggregate.getStatus(),
      description: aggregate.getDescription(),
      rulesCount: aggregate.getMapping().getRules().length,
      createdAt: aggregate.getCreatedAt(),
      updatedAt: aggregate.getUpdatedAt(),
    };
  }
}
