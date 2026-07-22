import { ValueObject } from '@saas/core';

export interface KitchenEventVersionProps {
  major: number;
  minor: number;
}

export class KitchenEventVersion extends ValueObject<KitchenEventVersionProps> {
  get major(): number {
    return this.props.major;
  }

  get minor(): number {
    return this.props.minor;
  }

  get value(): string {
    return `${this.major}.${this.minor}`;
  }

  private constructor(props: KitchenEventVersionProps) {
    super(props);
  }

  public static create(major: number, minor: number = 0): KitchenEventVersion {
    if (major < 1) {
      throw new Error('Major version must be >= 1');
    }
    if (minor < 0) {
      throw new Error('Minor version must be >= 0');
    }
    return new KitchenEventVersion({ major, minor });
  }

  public static fromString(version: string): KitchenEventVersion {
    const parts = version.split('.');
    if (parts.length === 0 || parts.length > 2) {
      throw new Error('Invalid version string format. Expected major.minor');
    }
    const major = parseInt(parts[0], 10);
    const minor = parts.length > 1 ? parseInt(parts[1], 10) : 0;
    
    if (isNaN(major) || isNaN(minor)) {
      throw new Error('Version parts must be numbers');
    }
    
    return KitchenEventVersion.create(major, minor);
  }
}
