export class RecipeCreatedEvent {
  constructor(public readonly recipeId: string, public readonly restaurantId: string) {}
}

export class RecipeUpdatedEvent {
  constructor(public readonly recipeId: string, public readonly restaurantId: string) {}
}

export class RecipeActivatedEvent {
  constructor(public readonly recipeId: string, public readonly restaurantId: string) {}
}

export class RecipeArchivedEvent {
  constructor(public readonly recipeId: string, public readonly restaurantId: string) {}
}
