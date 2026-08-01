/**
 * Enterprise KPI Platform - Domain Exceptions
 */

import { AnalyticsDomainException } from './analytics.exceptions';

export class KpiDomainException extends AnalyticsDomainException {
  constructor(message: string, code: string = 'KPI_DOMAIN_ERROR') {
    super(message, code);
  }
}

export class InvalidFormulaException extends KpiDomainException {
  constructor(formula: string, reason: string) {
    super(`Invalid KPI formula '${formula}': ${reason}`, 'INVALID_FORMULA');
  }
}

export class KpiNotFoundException extends KpiDomainException {
  constructor(id: string) {
    super(`KPI with ID '${id}' was not found`, 'KPI_NOT_FOUND');
  }
}
