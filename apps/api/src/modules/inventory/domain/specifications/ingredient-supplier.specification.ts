import { IngredientSupplier } from '../entities/ingredient-supplier.entity';

export class IngredientSupplierSpecification {
  public static isSatisfiedBy(suppliers: IngredientSupplier[], newSupplier: IngredientSupplier): boolean {
    // Check if supplier already exists for this ingredient
    const exists = suppliers.some(s => s.supplierId === newSupplier.supplierId);
    if (exists) {
      throw new Error(`Supplier ${newSupplier.supplierId} already exists for this ingredient`);
    }
    
    // Only one preferred supplier allowed
    if (newSupplier.isPreferred) {
      const hasPreferred = suppliers.some(s => s.isPreferred);
      if (hasPreferred) {
        throw new Error('An ingredient can only have one preferred supplier');
      }
    }

    return true;
  }
}
