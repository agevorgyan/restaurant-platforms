import { VersionNegotiationPolicy } from '../policies/core-acl.policies';
import { ContractVersion } from '../value-objects/contract-version.value-object';

export class CustomerVersionNegotiator {
  private supportedVersions = ['1.0', '1.1'];
  
  public negotiate(version: ContractVersion): ContractVersion {
    const negotiated = VersionNegotiationPolicy.resolve(version.version, this.supportedVersions);
    return ContractVersion.create(negotiated);
  }
}