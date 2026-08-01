/**
 * Enterprise Business Intelligence Platform - Domain Exceptions
 */

export class BiDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class CubeNotFoundException extends BiDomainException {
  constructor(cubeId: string) {
    super(`OLAP Cube with ID '${cubeId}' was not found`);
  }
}

export class InvalidDimensionException extends BiDomainException {
  constructor(message: string) {
    super(`Invalid Dimension: ${message}`);
  }
}

export class InvalidMeasureException extends BiDomainException {
  constructor(message: string) {
    super(`Invalid Measure: ${message}`);
  }
}

export class SemanticConsistencyException extends BiDomainException {
  constructor(message: string) {
    super(`Semantic Consistency Error: ${message}`);
  }
}

export class UnauthorizedAnalyticalAccessException extends BiDomainException {
  constructor(tenantId: string, resource: string) {
    super(`Tenant '${tenantId}' is unauthorized to access analytical resource '${resource}'`);
  }
}

export class InvalidDrillOperationException extends BiDomainException {
  constructor(message: string) {
    super(`Invalid Drill Operation: ${message}`);
  }
}
