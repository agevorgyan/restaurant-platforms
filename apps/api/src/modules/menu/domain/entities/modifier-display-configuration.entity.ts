import { Entity } from '@saas/core';

export interface ModifierDisplayConfigurationProps {
  id: string;
  columns: number;
  hideIfUnavailable: boolean;
}

export class ModifierDisplayConfiguration extends Entity<ModifierDisplayConfigurationProps> {
  get columns(): number { return this.props.columns; }
  get hideIfUnavailable(): boolean { return this.props.hideIfUnavailable; }

  private constructor(props: any) { super(props.id, props); }

  public static create(props: ModifierDisplayConfigurationProps): ModifierDisplayConfiguration {
    return new ModifierDisplayConfiguration(props);
  }
}