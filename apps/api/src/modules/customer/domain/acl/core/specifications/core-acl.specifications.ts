export class ContractCompatibilitySpecification {
  public static isCompatible(version: string, supportedVersions: string[]): boolean {
    return supportedVersions.includes(version);
  }
}

export class CustomerTranslationSpecification {
  public static canTranslate(payload: any): boolean {
    return !!payload;
  }
}

export class CustomerReferenceSpecification {
  public static isValid(ref: any): boolean {
    return !!ref && !!ref.externalId;
  }
}

export class ExternalIdentitySpecification {
  public static isValid(identity: any): boolean {
    return !!identity && !!identity.provider;
  }
}

export class ContractVersionSpecification {
  public static isSupported(version: string): boolean {
    return version === '1.0' || version === '1.1';
  }
}