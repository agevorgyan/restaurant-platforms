/**
 * Enterprise Restaurant Operations Analytics Platform - Main Package Index
 *
 * Barrel exports for operations analytics enums, domain events, value objects, ports, read models, and domain services.
 */

// Enums
export * from './domain/enums/ops-analytics.enums';

// Events
export * from './domain/events/ops-analytics.events';

// Value Objects
export * from './domain/value-objects/ops-analytics-vo';

// Ports
export * from './domain/ports/analytics-bridge.port';

// Read Models
export * from './read-models/ops-analytics.read-models';

// Domain Services
export * from './services/ops-analytics.services';
