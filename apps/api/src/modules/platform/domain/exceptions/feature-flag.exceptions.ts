/**
 * Enterprise Feature Flag Platform - Domain Exceptions
 *
 * Strongly-typed domain exceptions thrown by feature flag aggregates, value objects, and domain services
 * when invariant violations occur.
 */

export class InvalidTargetRuleException extends Error {
  constructor(message: string) {
    super(`[InvalidTargetRuleException] ${message}`);
    this.name = 'InvalidTargetRuleException';
  }
}

export class InvalidRolloutPolicyException extends Error {
  constructor(message: string) {
    super(`[InvalidRolloutPolicyException] ${message}`);
    this.name = 'InvalidRolloutPolicyException';
  }
}

export class FeatureFlagNotFoundException extends Error {
  constructor(id: string) {
    super(`[FeatureFlagNotFoundException] Feature flag with ID or key '${id}' was not found.`);
    this.name = 'FeatureFlagNotFoundException';
  }
}

export class KillSwitchActiveException extends Error {
  constructor(flagKey: string) {
    super(`[KillSwitchActiveException] Feature flag '${flagKey}' has an active emergency kill switch overriding evaluation.`);
    this.name = 'KillSwitchActiveException';
  }
}

export class UnauthorizedFeatureAccessException extends Error {
  constructor(tenantId: string, featureId: string) {
    super(`[UnauthorizedFeatureAccessException] Tenant '${tenantId}' does not have access to feature flag '${featureId}'.`);
    this.name = 'UnauthorizedFeatureAccessException';
  }
}
