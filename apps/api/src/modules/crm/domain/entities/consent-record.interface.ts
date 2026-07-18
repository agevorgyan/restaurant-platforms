import { ConsentStatus } from '../value-objects/consent-status.value-object';

export interface IConsentRecord {
  id: string;
  purpose: string;
  status: ConsentStatus;
  grantedAt?: Date;
  revokedAt?: Date;
  source: string;
  version: string;
}
