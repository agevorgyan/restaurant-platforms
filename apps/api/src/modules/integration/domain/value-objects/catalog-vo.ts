/**
 * Enterprise Integration Catalog - Domain Value Objects
 */

import { randomUUID } from 'crypto';
import { CertificationLevel, CompatibilityStatus } from '../enums/catalog.enums';
import { InvalidTemplateException } from '../exceptions/catalog.exceptions';

export class CatalogId {
  private constructor(private readonly value: string) {}

  public static create(value: string): CatalogId {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new InvalidTemplateException('CatalogId cannot be empty');
    }
    return new CatalogId(value.trim());
  }

  public static generate(): CatalogId {
    return new CatalogId(randomUUID());
  }

  public getValue(): string {
    return this.value;
  }
}

export class CatalogEntryId {
  private constructor(private readonly value: string) {}

  public static create(slug?: string): CatalogEntryId {
    const val = slug?.trim() || `entry_${randomUUID()}`;
    return new CatalogEntryId(val);
  }

  public getValue(): string {
    return this.value;
  }
}

export class ConnectorTemplateId {
  private constructor(private readonly value: string) {}

  public static create(id?: string): ConnectorTemplateId {
    const val = id?.trim() || `tmpl_${randomUUID()}`;
    return new ConnectorTemplateId(val);
  }

  public getValue(): string {
    return this.value;
  }
}

export class ConnectorVersionVO {
  private static readonly SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

  private constructor(private readonly value: string) {}

  public static create(versionStr: string = '1.0.0'): ConnectorVersionVO {
    const trimmed = versionStr?.trim();
    if (!trimmed || !ConnectorVersionVO.SEMVER_REGEX.test(trimmed)) {
      throw new InvalidTemplateException(`Invalid SemVer format for ConnectorVersion: '${versionStr}'`);
    }
    return new ConnectorVersionVO(trimmed);
  }

  public getValue(): string {
    return this.value;
  }
}

export class CertificationLevelVO {
  private constructor(public readonly level: CertificationLevel) {}

  public static default(): CertificationLevelVO {
    return new CertificationLevelVO(CertificationLevel.DRAFT);
  }

  public static create(level: CertificationLevel = CertificationLevel.DRAFT): CertificationLevelVO {
    return new CertificationLevelVO(level);
  }

  public isCertified(): boolean {
    return this.level === CertificationLevel.CERTIFIED || this.level === CertificationLevel.ENTERPRISE;
  }
}

export class SupportedFeature {
  constructor(
    public readonly code: string,
    public readonly name: string,
    public readonly description: string
  ) {}

  public static create(code: string, name: string, description: string = ''): SupportedFeature {
    if (!code || code.trim().length === 0) {
      throw new InvalidTemplateException('Feature code is mandatory');
    }
    return new SupportedFeature(code.trim().toUpperCase(), name.trim(), description.trim());
  }
}

export class VendorInformation {
  constructor(
    public readonly name: string,
    public readonly website: string,
    public readonly supportEmail: string,
    public readonly slaTier: string = 'GOLD'
  ) {}

  public static create(name: string, website: string, supportEmail: string, slaTier?: string): VendorInformation {
    if (!name || !supportEmail) {
      throw new InvalidTemplateException('Vendor name and supportEmail are mandatory');
    }
    return new VendorInformation(name.trim(), website.trim(), supportEmail.trim(), slaTier || 'GOLD');
  }
}

export class DocumentationReference {
  constructor(
    public readonly docsUrl: string,
    public readonly apiReferenceUrl?: string,
    public readonly guideUrl?: string
  ) {}

  public static create(docsUrl: string, apiReferenceUrl?: string, guideUrl?: string): DocumentationReference {
    return new DocumentationReference(docsUrl.trim(), apiReferenceUrl?.trim(), guideUrl?.trim());
  }
}

export class MarketplaceMetadata {
  constructor(
    public readonly shortDescription: string,
    public readonly detailedMarkdown: string,
    public readonly tags: string[],
    public readonly categories: string[],
    public readonly pricingModel: string = 'FREE',
    public readonly rating: number = 5.0,
    public readonly downloadCount: number = 0
  ) {}

  public static create(params: {
    shortDescription: string;
    detailedMarkdown?: string;
    tags?: string[];
    categories?: string[];
    pricingModel?: string;
  }): MarketplaceMetadata {
    return new MarketplaceMetadata(
      params.shortDescription.trim(),
      params.detailedMarkdown || '',
      params.tags || [],
      params.categories || [],
      params.pricingModel || 'FREE'
    );
  }
}

export class CompatibilityMatrix {
  constructor(
    public readonly minPlatformVersion: string = '1.0.0',
    public readonly maxPlatformVersion?: string,
    public readonly status: CompatibilityStatus = CompatibilityStatus.SUPPORTED
  ) {}

  public static default(): CompatibilityMatrix {
    return new CompatibilityMatrix();
  }

  public static create(minVer: string = '1.0.0', status: CompatibilityStatus = CompatibilityStatus.SUPPORTED): CompatibilityMatrix {
    return new CompatibilityMatrix(minVer, undefined, status);
  }
}
