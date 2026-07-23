import { Entity } from '@saas/core';

export interface MenuItemAvailabilityOverrideProps {
  id: string;
  locationId: string;
  isAvailable: boolean;
}

export class MenuItemAvailabilityOverride extends Entity<MenuItemAvailabilityOverrideProps> {
  get locationId(): string { return this.props.locationId; }
  get isAvailable(): boolean { return this.props.isAvailable; }

  private constructor(props: MenuItemAvailabilityOverrideProps) { super(props.id, props); }

  public static create(props: MenuItemAvailabilityOverrideProps): MenuItemAvailabilityOverride {
    if (!props.locationId) throw new Error('LocationId cannot be empty');
    return new MenuItemAvailabilityOverride(props);
  }
}