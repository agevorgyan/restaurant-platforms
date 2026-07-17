import { IModifierOption } from '../entities/modifier-option.interface';

export class ModifierOptionCreatedEvent {
  constructor(public readonly modifierOption: IModifierOption) {}
}

export class ModifierOptionUpdatedEvent {
  constructor(public readonly modifierOption: IModifierOption) {}
}

export class ModifierOptionArchivedEvent {
  constructor(public readonly modifierOptionId: string, public readonly restaurantId: string) {}
}
