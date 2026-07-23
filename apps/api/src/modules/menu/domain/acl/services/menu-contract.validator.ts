import { MenuIntegrationPolicy, ContractValidationPolicy, VersionCompatibilityPolicy } from '../policies/menu-acl.policies';

export class MenuContractValidator {
  public validateInbound(payload: any, expectedVersion: string): void {
    ContractValidationPolicy.ensureStrictCompliance(payload);
    MenuIntegrationPolicy.validateMetadata(payload.metadata);
    VersionCompatibilityPolicy.enforce(payload.metadata.eventVersion, expectedVersion);
  }
}