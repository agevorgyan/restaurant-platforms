/**
 * Enterprise AI Agent Platform - Domain Exceptions
 */

import { AiDomainException } from './ai.exceptions';

export class AgentDomainException extends AiDomainException {
  constructor(message: string, code: string = 'AGENT_DOMAIN_ERROR') {
    super(message, code);
  }
}

export class HumanApprovalRequiredException extends AgentDomainException {
  constructor(taskId: string, actionName: string, riskLevel: string = 'HIGH') {
    super(
      `Execution paused for task '${taskId}': Action '${actionName}' has risk level '${riskLevel}' and requires human administrator approval.`,
      'HUMAN_APPROVAL_REQUIRED'
    );
  }
}

export class ExecutionFailedException extends AgentDomainException {
  constructor(reason: string) {
    super(`Agent goal execution failed: ${reason}`, 'EXECUTION_FAILED');
  }
}

export class AgentNotFoundException extends AgentDomainException {
  constructor(id: string) {
    super(`AI Agent with ID '${id}' was not found`, 'AGENT_NOT_FOUND');
  }
}
