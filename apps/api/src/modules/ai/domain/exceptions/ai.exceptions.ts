/**
 * Enterprise AI Gateway - Domain Exceptions
 */

export class AiDomainException extends Error {
  constructor(message: string, public readonly code: string = 'AI_DOMAIN_ERROR') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ProviderUnavailableException extends AiDomainException {
  constructor(providerName: string, reason?: string) {
    super(
      `AI Provider '${providerName}' is currently unavailable. ${reason || ''}`,
      'PROVIDER_UNAVAILABLE'
    );
  }
}

export class ModelNotFoundException extends AiDomainException {
  constructor(modelId: string) {
    super(`AI Model '${modelId}' is not registered or supported by any active provider`, 'MODEL_NOT_FOUND');
  }
}

export class CostLimitExceededException extends AiDomainException {
  constructor(tenantId: string, currentCostUsd: number, maxLimitUsd: number) {
    super(
      `Cost threshold exceeded for tenant '${tenantId}': Current spend $${currentCostUsd.toFixed(4)} exceeds limit $${maxLimitUsd.toFixed(4)}`,
      'COST_LIMIT_EXCEEDED'
    );
  }
}

export class InferenceExecutionException extends AiDomainException {
  constructor(reason: string) {
    super(`Inference execution failed: ${reason}`, 'INFERENCE_FAILED');
  }
}
