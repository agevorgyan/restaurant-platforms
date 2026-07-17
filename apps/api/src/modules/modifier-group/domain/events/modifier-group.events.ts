import { IModifierGroup } from '../entities/modifier-group.interface';

export class ModifierGroupCreatedEvent {
  constructor(public readonly modifierGroup: IModifierGroup) {}
}

export class ModifierGroupUpdatedEvent {
  constructor(public readonly modifierGroup: IModifierGroup) {}
}

export class ModifierGroupArchivedEvent {
  constructor(public readonly modifierGroupId: string, public readonly restaurantId: string) {}
}
