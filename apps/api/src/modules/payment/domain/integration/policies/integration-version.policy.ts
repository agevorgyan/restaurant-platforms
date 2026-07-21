import { PaymentEventVersion } from '../value-objects/payment-event-version.value-object';

export class IntegrationVersionPolicy {
  public evaluate(version: PaymentEventVersion): { isSupported: boolean; message?: string } {
    if (version.major === 0) {
      return { isSupported: false, message: 'Experimental versions are not allowed in production integrations' };
    }
    
    // Only major version 1 is currently supported in this API layer
    if (version.major > 1) {
      return { isSupported: false, message: 'Major versions above 1 are not yet supported by this ACL' };
    }

    return { isSupported: true };
  }
}
