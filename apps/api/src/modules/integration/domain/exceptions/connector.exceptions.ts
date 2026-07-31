/**
 * Enterprise Connector Platform - Domain Exceptions
 */

export class ConnectorDomainException extends Error {
  constructor(message: string, public readonly code: string = 'CONNECTOR_DOMAIN_ERROR') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidConfigurationException extends ConnectorDomainException {
  constructor(message: string, public readonly validationErrors: string[] = []) {
    super(message, 'INVALID_CONNECTOR_CONFIGURATION');
  }
}

export class InvalidCredentialReferenceException extends ConnectorDomainException {
  constructor(message: string) {
    super(message, 'INVALID_CREDENTIAL_REFERENCE');
  }
}

export class ConnectorStateTransitionException extends ConnectorDomainException {
  constructor(fromState: string, toState: string, reason?: string) {
    const detail = reason ? `: ${reason}` : '';
    super(`Illegal connector state transition from '${fromState}' to '${toState}'${detail}`, 'INVALID_STATE_TRANSITION');
  }
}

export class VersionMismatchException extends ConnectorDomainException {
  constructor(message: string) {
    super(message, 'VERSION_MISMATCH');
  }
}

export class CapabilityNotSupportedException extends ConnectorDomainException {
  constructor(capability: string, connectorType: string) {
    super(`Capability '${capability}' is not supported by connector type '${connectorType}'`, 'CAPABILITY_NOT_SUPPORTED');
  }
}

export class ConnectorNotFoundException extends ConnectorDomainException {
  constructor(connectorId: string) {
    super(`Connector with ID '${connectorId}' was not found`, 'CONNECTOR_NOT_FOUND');
  }
}
