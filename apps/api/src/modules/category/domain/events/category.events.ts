import { ICategory } from '../entities/category.interface';

export class CategoryCreatedEvent {
  constructor(public readonly category: ICategory) {}
}

export class CategoryUpdatedEvent {
  constructor(public readonly category: ICategory) {}
}

export class CategoryDeletedEvent {
  constructor(public readonly categoryId: string, public readonly menuId: string) {}
}

export class CategoryMovedEvent {
  constructor(
    public readonly categoryId: string, 
    public readonly newParentId: string | undefined, 
    public readonly newSortOrder: number
  ) {}
}
