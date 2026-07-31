/**
 * Enterprise Data Transformation Platform - Domain Exceptions
 */

export class TransformationDomainException extends Error {
  constructor(message: string, public readonly code: string = 'TRANSFORMATION_DOMAIN_ERROR') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class SchemaValidationException extends TransformationDomainException {
  constructor(message: string, public readonly validationErrors: string[] = []) {
    super(message, 'SCHEMA_VALIDATION_FAILED');
  }
}

export class MappingExecutionException extends TransformationDomainException {
  constructor(message: string, public readonly fieldName?: string) {
    super(message, 'MAPPING_EXECUTION_FAILED');
  }
}

export class ImmutableMappingException extends TransformationDomainException {
  constructor(transformationId: string, version: string) {
    super(
      `Transformation '${transformationId}' version '${version}' is PUBLISHED and immutable. Create a new version to modify mapping rules.`,
      'IMMUTABLE_MAPPING_ERROR'
    );
  }
}

export class TransformationNotFoundException extends TransformationDomainException {
  constructor(id: string) {
    super(`Transformation definition with ID '${id}' was not found`, 'TRANSFORMATION_NOT_FOUND');
  }
}
