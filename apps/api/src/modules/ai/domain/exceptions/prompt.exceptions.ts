/**
 * Enterprise Prompt Management Platform - Domain Exceptions
 */

import { AiDomainException } from './ai.exceptions';

export class PublishedPromptImmutableException extends AiDomainException {
  constructor(promptId: string, version: string) {
    super(
      `Prompt '${promptId}' version '${version}' is PUBLISHED and immutable. Create a new version to modify template content or variables.`,
      'PUBLISHED_PROMPT_IMMUTABLE'
    );
  }
}

export class InvalidPromptVariableException extends AiDomainException {
  constructor(variableName: string, reason?: string) {
    super(`Prompt variable '${variableName}' validation failed: ${reason || 'Invalid binding'}`, 'INVALID_PROMPT_VARIABLE');
  }
}

export class PromptApprovalException extends AiDomainException {
  constructor(reason: string) {
    super(`Prompt governance approval error: ${reason}`, 'PROMPT_APPROVAL_ERROR');
  }
}

export class PromptNotFoundException extends AiDomainException {
  constructor(id: string) {
    super(`Prompt with ID '${id}' was not found`, 'PROMPT_NOT_FOUND');
  }
}
