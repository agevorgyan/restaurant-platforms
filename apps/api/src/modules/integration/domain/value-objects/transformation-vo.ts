/**
 * Enterprise Data Transformation Platform - Domain Value Objects
 */

import { randomUUID } from 'crypto';
import { MappingType, MappingResultEnum } from '../enums/transformation.enums';
import { MappingExecutionException, SchemaValidationException } from '../exceptions/transformation.exceptions';

export class TransformationId {
  private constructor(private readonly value: string) {}

  public static create(value: string): TransformationId {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new MappingExecutionException('TransformationId cannot be empty');
    }
    return new TransformationId(value.trim());
  }

  public static generate(): TransformationId {
    return new TransformationId(randomUUID());
  }

  public getValue(): string {
    return this.value;
  }
}

export class TransformationVersion {
  private static readonly SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

  private constructor(private readonly value: string) {}

  public static create(versionStr: string): TransformationVersion {
    const trimmed = versionStr?.trim();
    if (!trimmed || !TransformationVersion.SEMVER_REGEX.test(trimmed)) {
      throw new MappingExecutionException(`Invalid SemVer format for TransformationVersion: '${versionStr}'`);
    }
    return new TransformationVersion(trimmed);
  }

  public getValue(): string {
    return this.value;
  }
}

export class SchemaVersion {
  private constructor(private readonly value: string) {}

  public static create(versionStr: string): SchemaVersion {
    const trimmed = versionStr?.trim() || '1.0.0';
    return new SchemaVersion(trimmed);
  }

  public getValue(): string {
    return this.value;
  }
}

export class SchemaDefinition {
  private constructor(
    public readonly name: string,
    public readonly version: SchemaVersion,
    public readonly jsonSchema: Record<string, unknown>
  ) {}

  public static create(name: string, jsonSchema: Record<string, unknown>, versionStr?: string): SchemaDefinition {
    if (!name || name.trim().length === 0) {
      throw new SchemaValidationException('Schema name is mandatory');
    }
    return new SchemaDefinition(name.trim(), SchemaVersion.create(versionStr || '1.0.0'), jsonSchema || {});
  }
}

export class SourceField {
  private constructor(private readonly path: string) {}

  public static create(path: string): SourceField {
    const trimmed = path?.trim();
    if (!trimmed) {
      throw new MappingExecutionException('SourceField path cannot be empty');
    }
    return new SourceField(trimmed);
  }

  public getPath(): string {
    return this.path;
  }
}

export class TargetField {
  private constructor(private readonly path: string) {}

  public static create(path: string): TargetField {
    const trimmed = path?.trim();
    if (!trimmed) {
      throw new MappingExecutionException('TargetField path cannot be empty');
    }
    return new TargetField(trimmed);
  }

  public getPath(): string {
    return this.path;
  }
}

export interface MappingRuleProps {
  sourceField: SourceField;
  targetField: TargetField;
  mappingType: MappingType;
  expression?: string;
  lookupTable?: Record<string, string>;
  condition?: string;
  defaultValue?: unknown;
}

export class MappingRule {
  private constructor(private readonly props: MappingRuleProps) {}

  public static create(props: {
    sourcePath: string;
    targetPath: string;
    mappingType?: MappingType;
    expression?: string;
    lookupTable?: Record<string, string>;
    condition?: string;
    defaultValue?: unknown;
  }): MappingRule {
    const sourceField = SourceField.create(props.sourcePath);
    const targetField = TargetField.create(props.targetPath);
    const mappingType = props.mappingType || MappingType.ONE_TO_ONE;

    return new MappingRule({
      sourceField,
      targetField,
      mappingType,
      expression: props.expression,
      lookupTable: props.lookupTable,
      condition: props.condition,
      defaultValue: props.defaultValue,
    });
  }

  public getProps(): MappingRuleProps {
    return { ...this.props };
  }
}

export class MappingDefinition {
  private constructor(private readonly rules: MappingRule[]) {}

  public static create(rules: MappingRule[] = []): MappingDefinition {
    return new MappingDefinition([...rules]);
  }

  public getRules(): MappingRule[] {
    return [...this.rules];
  }
}

export class TransformationContext {
  private constructor(
    public readonly tenantId: string,
    public readonly connectorId: string,
    public readonly variables: Record<string, unknown>
  ) {}

  public static create(tenantId: string, connectorId: string, variables?: Record<string, unknown>): TransformationContext {
    return new TransformationContext(tenantId, connectorId, variables || {});
  }
}

export class ValidationResult {
  private constructor(
    public readonly isValid: boolean,
    public readonly errors: string[]
  ) {}

  public static valid(): ValidationResult {
    return new ValidationResult(true, []);
  }

  public static invalid(errors: string[]): ValidationResult {
    return new ValidationResult(false, errors);
  }
}

export class TransformationResult {
  constructor(
    public readonly resultStatus: MappingResultEnum,
    public readonly outputData: Record<string, unknown>,
    public readonly fieldsMappedCount: number,
    public readonly durationMs: number,
    public readonly errors: string[] = []
  ) {}

  public isSuccess(): boolean {
    return this.resultStatus === MappingResultEnum.SUCCESS;
  }
}
