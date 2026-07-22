export interface RecipeRepository {
  findById(id: string): Promise<any | null>;
}
