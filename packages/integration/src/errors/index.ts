export class IntegrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class UnknownContractError extends IntegrationError {}
export class UnknownVersionError extends IntegrationError {}
export class DuplicateContractError extends IntegrationError {}
export class ContractValidationError extends IntegrationError {}
export class TranslationFailureError extends IntegrationError {}
export class ReferenceResolutionError extends IntegrationError {}
export class VersionNegotiationError extends IntegrationError {}
