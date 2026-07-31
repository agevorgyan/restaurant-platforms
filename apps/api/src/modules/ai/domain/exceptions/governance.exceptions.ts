/**
 * Enterprise AI Governance & Certification Platform - Domain Exceptions
 */

import { AiDomainException } from './ai.exceptions';

export class GovernanceDomainException extends AiDomainException {
  constructor(message: string, code: string = 'GOVERNANCE_DOMAIN_ERROR') {
    super(message, code);
  }
}

export class PolicyViolationException extends GovernanceDomainException {
  constructor(policyName: string, reason: string) {
    super(`AI Policy '${policyName}' violation: ${reason}`, 'POLICY_VIOLATION');
  }
}

export class PolicyNotFoundException extends GovernanceDomainException {
  constructor(id: string) {
    super(`Governance Policy '${id}' was not found`, 'POLICY_NOT_FOUND');
  }
}
