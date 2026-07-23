import { Entity } from '@saas/core';
import { MenuName } from '../value-objects/menu-name.value-object';
import { DisplayOrder } from '../value-objects/display-order.value-object';
import { MenuSection } from './menu-section.entity';

export interface MenuCategoryProps {
  id: string;
  name: MenuName;
  displayOrder: DisplayOrder;
  sections: MenuSection[];
}

export class MenuCategory extends Entity<MenuCategoryProps> {
  get id(): string { return this.props.id; }
  get name(): MenuName { return this.props.name; }
  get displayOrder(): DisplayOrder { return this.props.displayOrder; }
  get sections(): MenuSection[] { return this.props.sections; }

  public addSection(section: MenuSection): void {
    if (this.props.sections.some(s => s.name.value === section.name.value)) {
      throw new Error(`Section name ${section.name.value} must be unique within Category`);
    }
    this.props.sections.push(section);
  }

  public removeSection(sectionId: string): void {
    this.props.sections = this.props.sections.filter(s => s.id !== sectionId);
  }

  private constructor(props: any) { super(props.id, props); }
  public static create(props: MenuCategoryProps): MenuCategory {
    return new MenuCategory(props);
  }
}