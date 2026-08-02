/**
 * Enterprise Inventory Analytics Platform - Main Package Index
 *
 * Barrel exports for inventory analytics enums, domain events, value objects, ports, read models, and domain services.
 */

// Enums
export * from './domain/enums/inventory-analytics.enums';

// Events
export * from './domain/events/inventory-analytics.events';

// Value Objects
export * from './domain/value-objects/inventory-analytics-vo';

// Ports
export * from './domain/ports/inventory-analytics-bridge.port';

// Read Models
export * from './read-models/inventory-analytics.read-models';

// Domain Services
export * from './services/inventory-analytics.services';
