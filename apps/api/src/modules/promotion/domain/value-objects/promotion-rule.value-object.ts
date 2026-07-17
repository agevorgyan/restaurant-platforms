export class PromotionRule {
  constructor(
    public readonly minOrderAmount?: number,
    public readonly minQuantity?: number,
    public readonly applicableProductIds?: string[],
    public readonly applicableCategoryIds?: string[],
    public readonly applicableBranchIds?: string[],
    public readonly specificCustomerIds?: string[]
  ) {}
}
