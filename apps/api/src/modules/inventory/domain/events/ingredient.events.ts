export class IngredientCreatedEvent {
  constructor(public readonly ingredientId: string, public readonly restaurantId: string) {}
}

export class IngredientUpdatedEvent {
  constructor(public readonly ingredientId: string, public readonly restaurantId: string) {}
}

export class IngredientActivatedEvent {
  constructor(public readonly ingredientId: string, public readonly restaurantId: string) {}
}

export class IngredientArchivedEvent {
  constructor(public readonly ingredientId: string, public readonly restaurantId: string) {}
}
