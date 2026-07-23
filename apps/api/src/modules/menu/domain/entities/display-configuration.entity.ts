import { Entity } from '@saas/core';
import { DisplayPriority } from '../value-objects/display-priority.value-object';

export interface DisplayConfigurationProps {
  id: string;
  priority: DisplayPriority;
  isFeatured: boolean;
}

export class DisplayConfiguration extends Entity<DisplayConfigurationProps> {
  get id(): string { return this.props.id; }
  get priority(): DisplayPriority { return this.props.priority; }
  get isFeatured(): boolean { return this.props.isFeatured; }

  private constructor(props: any) { super(props.id, props); }
  public static create(props: DisplayConfigurationProps): DisplayConfiguration {
    return new DisplayConfiguration(props);
  }
}