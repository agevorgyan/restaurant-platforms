import { VersionCompatibilityPolicy } from '../policies/acl.policy';

export class ProcurementVersionResolver {
  public resolve(schemaVersion: string): void {
    VersionCompatibilityPolicy.checkCompatibility(schemaVersion);
  }
}