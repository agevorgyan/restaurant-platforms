export class CustomerAddressSpecification {
  public static isUnique(address: any, existingAddresses: any[]): boolean {
    return !existingAddresses.some(a => a.id === address.id);
  }
}

export class AddressVerificationSpecification {
  public static isVerified(verification: any): boolean {
    return verification.status.status === 'VERIFIED';
  }
}

export class DefaultAddressSpecification {
  public static validateDefaults(addresses: any[]): boolean {
    const deliveryDefaults = addresses.filter(a => a.isDefaultDelivery);
    const billingDefaults = addresses.filter(a => a.isDefaultBilling);
    return deliveryDefaults.length <= 1 && billingDefaults.length <= 1;
  }
}

export class CommunicationPreferenceSpecification {
  public static hasUniqueChannels(preferences: any[]): boolean {
    const channels = preferences.map(p => p.channel.channel);
    return new Set(channels).size === channels.length;
  }
}

export class GeoLocationSpecification {
  public static isValid(geo: any): boolean {
    return geo.lat.value >= -90 && geo.lat.value <= 90 && geo.lng.value >= -180 && geo.lng.value <= 180;
  }
}