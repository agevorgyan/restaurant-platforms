import { ValueObject } from '@saas/core';

export interface MenuCategoryReferenceProps { categoryId: string; }

export class MenuCategoryReference extends ValueObject<MenuCategoryReferenceProps> {
  get categoryId(): string { return this.props.categoryId; }
  private constructor(props: MenuCategoryReferenceProps) { super(props); }
  public static create(categoryId: string): MenuCategoryReference {
    if (!categoryId) throw new Error('MenuCategoryReference cannot be empty');
    return new MenuCategoryReference({ categoryId });
  }
}