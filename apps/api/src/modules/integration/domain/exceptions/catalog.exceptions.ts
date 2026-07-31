/**
 * Enterprise Integration Catalog - Domain Exceptions
 */

export class CatalogDomainException extends Error {
  constructor(message: string, public readonly code: string = 'CATALOG_DOMAIN_ERROR') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidTemplateException extends CatalogDomainException {
  constructor(reason: string) {
    super(`Invalid catalog connector template: ${reason}`, 'INVALID_TEMPLATE');
  }
}

export class CertifiedTemplateImmutableException extends CatalogDomainException {
  constructor(catalogId: string, level: string) {
    super(
      `Catalog entry '${catalogId}' is certified at level '${level}' and immutable. Publish a new version to modify template definitions.`,
      'CERTIFIED_TEMPLATE_IMMUTABLE'
    );
  }
}

export class CatalogEntryNotFoundException extends CatalogDomainException {
  constructor(id: string) {
    super(`Catalog entry with ID '${id}' was not found`, 'CATALOG_ENTRY_NOT_FOUND');
  }
}
