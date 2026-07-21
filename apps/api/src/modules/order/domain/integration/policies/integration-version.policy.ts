import { OrderEventVersion } from '../value-objects/order-event-version.value-object';

export class IntegrationVersionPolicy {
  public getDefaultVersion(): OrderEventVersion {
    return OrderEventVersion.create(1, 0);
  }

  public validateBump(oldVersion: OrderEventVersion, newVersion: OrderEventVersion): boolean {
    if (newVersion.major < oldVersion.major) {
      return false; // Cannot downgrade major
    }
    
    if (newVersion.major === oldVersion.major && newVersion.minor < oldVersion.minor) {
      return false; // Cannot downgrade minor on same major
    }
    
    return true;
  }
}
