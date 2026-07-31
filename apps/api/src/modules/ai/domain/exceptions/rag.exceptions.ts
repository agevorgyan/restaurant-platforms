/**
 * Enterprise RAG Platform - Domain Exceptions
 */

import { AiDomainException } from './ai.exceptions';

export class RagDomainException extends AiDomainException {
  constructor(message: string, code: string = 'RAG_DOMAIN_ERROR') {
    super(message, code);
  }
}

export class ContextBudgetExceededException extends RagDomainException {
  constructor(requestedTokens: number, maxBudgetTokens: number) {
    super(
      `Context token budget exceeded: Assembled context of ${requestedTokens} tokens exceeds budget ceiling of ${maxBudgetTokens} tokens`,
      'CONTEXT_BUDGET_EXCEEDED'
    );
  }
}

export class GroundingFailedException extends RagDomainException {
  constructor(score: number, minRequired: number) {
    super(
      `Grounding verification failed: Answer grounding score (${score.toFixed(1)}%) is below minimum requirement (${minRequired.toFixed(1)}%)`,
      'GROUNDING_FAILED'
    );
  }
}
