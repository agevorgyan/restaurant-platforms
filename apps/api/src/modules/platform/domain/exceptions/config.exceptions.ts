/**
 * Enterprise Distributed Configuration Platform - Domain Exceptions
 *
 * Strongly-typed domain exceptions thrown by configuration aggregates, value objects, and domain services
 * when invariant violations occur.
 */

export class InvalidConfigurationSchemaException extends Error {
  constructor(message: string) {
    super(`[InvalidConfigurationSchemaException] ${message}`);
    this.name = 'InvalidConfigurationSchemaException';
  }
}

export class ImmutableConfigurationException extends Error {
  constructor(configId: string, version: string) {
    super(`[ImmutableConfigurationException] Configuration '${configId}' (v${version}) is published and immutable. Create a new draft revision to modify.`);
    this.name = 'ImmutableConfigurationException';
  }
}

export class ConfigurationNotFoundException extends Error {
  constructor(id: string) {
    super(`[ConfigurationNotFoundException] Configuration with ID or key '${id}' was not found.`);
    this.name = 'ConfigurationNotFoundException';
  }
}

export class InvalidEnvironmentException extends Error {
  constructor(env: string) {
    super(`[InvalidEnvironmentException] Environment '${env}' is invalid or unsupported.`);
    this.name = 'InvalidEnvironmentException';
  }
}

export class PropagationFailedException extends Error {
  constructor(configId: string, reason: string) {
    super(`[PropagationFailedException] Configuration '${configId}' propagation failed: ${reason}`);
    this.name = 'PropagationFailedException';
  }
}

export class UnauthorizedConfigurationAccessException extends Error {
  constructor(tenantId: string, configId: string) {
    super(`[UnauthorizedConfigurationAccessException] Tenant '${tenantId}' does not have access to configuration '${configId}'.`);
    this.name = 'UnauthorizedConfigurationAccessException';
  }
}
