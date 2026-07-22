import { ValueObject } from '@saas/core';

export interface InventoryEventVersionProps {
  major: number;
  minor: number;
}

export class InventoryEventVersion extends ValueObject<InventoryEventVersionProps> {
  get major(): number {
    return this.props.major;
  }

  get minor(): number {
    return this.props.minor;
  }

  get versionString(): string {
    return `v${this.major}.${this.minor}`;
  }

  private constructor(props: InventoryEventVersionProps) {
    super(props);
  }

  public static create(major: number, minor: number = 0): InventoryEventVersion {
    if (major < 1) {
      throw new Error('Major version must be greater than or equal to 1');
    }
    if (minor < 0) {
      throw new Error('Minor version cannot be negative');
    }

    return new InventoryEventVersion({ major, minor });
  }

  public static fromString(version: string): InventoryEventVersion {
    const match = version.match(/^v?(\d+)(?:\.(\d+))?$/);
    if (!match) {
      throw new Error(`Invalid version string format: ${version}`);
    }

    const major = parseInt(match[1], 10);
    const minor = match[2] ? parseInt(match[2], 10) : 0;

    return InventoryEventVersion.create(major, minor);
  }

  public isCompatibleWith(other: InventoryEventVersion): boolean {
    // Backwards compatibility assumption: same major version, minor version can be \u003e=
    return this.major === other.major && this.minor >= other.minor;
  }
}
