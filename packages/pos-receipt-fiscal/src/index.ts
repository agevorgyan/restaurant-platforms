/**
 * Enterprise Receipt & Fiscal Platform - Main Package Index
 *
 * Barrel exports for receipt enums, domain events, value objects, ports, read models, and domain services.
 */

// Enums
export * from './domain/enums/pos-receipt-fiscal.enums';

// Events
export * from './domain/events/pos-receipt-fiscal.events';

// Value Objects
export * from './domain/value-objects/pos-receipt-fiscal-vo';

// Ports
export * from './domain/ports/fiscal-provider.port';

// Read Models
export * from './read-models/pos-receipt-fiscal.read-models';

// Domain Services
export * from './services/pos-receipt-fiscal.services';
