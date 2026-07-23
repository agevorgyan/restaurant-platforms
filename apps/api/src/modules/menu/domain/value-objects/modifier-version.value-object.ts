import { ValueObject } from '@saas/core';

export interface ModifierVersionProps { version: number; }

export class ModifierVersion extends ValueObject<ModifierVersionProps> {
  get version(): number { return this.props.version; }
  private constructor(props: ModifierVersionProps) { super(props); }
  public static create(version: number = 1): ModifierVersion {
    if (version < 1) throw new Error('ModifierVersion must be >= 1');
    return new ModifierVersion({ version });
  }
}