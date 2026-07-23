import { AggregateRoot } from '@saas/core';
import { MenuId } from '../value-objects/menu-id.value-object';
import { MenuName } from '../value-objects/menu-name.value-object';
import { MenuCode } from '../value-objects/menu-code.value-object';
import { MenuDescription } from '../value-objects/menu-description.value-object';
import { MenuStatus } from '../enums/menu.enums';
import { MenuVersion } from '../value-objects/menu-version.value-object';
import { MenuCategory } from '../entities/menu-category.entity';
import { MenuLayout } from '../entities/menu-layout.entity';
import { MenuVisibilityRule } from '../entities/menu-visibility-rule.entity';
import { DisplayConfiguration } from '../entities/display-configuration.entity';
import { 
  MenuCreatedEvent, MenuPublishedEvent, MenuActivatedEvent, MenuArchivedEvent,
  CategoryAddedEvent, SectionAddedEvent,
  MenuItemLinkedEvent
} from '../events/menu.events';
import { MenuLifecyclePolicy } from '../policies/menu-aggregate.policies';
import { MenuConsistencySpecification } from '../specifications/menu-aggregate.specifications';
import { MenuSection } from '../entities/menu-section.entity';
import { MenuItemReference } from '../value-objects/menu-item-reference.value-object';

export interface MenuProps {
  id: MenuId;
  name: MenuName;
  code: MenuCode;
  description: MenuDescription;
  status: MenuStatus;
  version: MenuVersion;
  categories: MenuCategory[];
  layout: MenuLayout;
  visibilityRules: MenuVisibilityRule[];
  displayConfig: DisplayConfiguration;
}

export class Menu extends AggregateRoot<MenuProps> {
  
  get name(): MenuName { return this.props.name; }
  get code(): MenuCode { return this.props.code; }
  get description(): MenuDescription { return this.props.description; }
  get status(): MenuStatus { return this.props.status; }
  get version(): MenuVersion { return this.props.version; }
  get categories(): MenuCategory[] { return this.props.categories; }

  private constructor(props: MenuProps) {
    super(props.id.value, props);
  }

  public static create(props: MenuProps): Menu {
    const menu = new Menu({ ...props, status: MenuStatus.DRAFT });
    menu.addDomainEvent(new MenuCreatedEvent(menu.id));
    return menu;
  }

  public publish(): void {
    if (!MenuLifecyclePolicy.canPublish(this)) {
      throw new Error('Menu cannot be published. Must have at least one category and be in DRAFT state.');
    }
    // Check if category is not empty
    if (this.categories.some(c => c.sections.length === 0)) {
      throw new Error('Category cannot be empty');
    }
    this.props.status = MenuStatus.PUBLISHED;
    this.addDomainEvent(new MenuPublishedEvent(this.id));
  }

  public activate(): void {
    if (!MenuLifecyclePolicy.canActivate(this)) {
      throw new Error('Menu must be PUBLISHED before it can be ACTIVE');
    }
    this.props.status = MenuStatus.ACTIVE;
    this.addDomainEvent(new MenuActivatedEvent(this.id));
  }

  public archive(): void {
    this.props.status = MenuStatus.ARCHIVED;
    this.addDomainEvent(new MenuArchivedEvent(this.id));
  }

  public updateCode(code: MenuCode): void {
    if (this.status !== MenuStatus.DRAFT) {
      throw new Error('Immutable MenuCode after publication');
    }
    this.props.code = code;
  }

  public addCategory(category: MenuCategory): void {
    if (this.categories.some(c => c.name.value === category.name.value)) {
      throw new Error('Unique Category names within Menu violated');
    }
    this.props.categories.push(category);
    this.addDomainEvent(new CategoryAddedEvent(this.id, category.id));
    if (!MenuConsistencySpecification.isSatisfiedBy(this)) {
      this.props.categories.pop();
      throw new Error('Menu consistency violated');
    }
  }

  public addSectionToCategory(categoryId: string, section: MenuSection): void {
    const category = this.categories.find(c => c.id === categoryId);
    if (!category) throw new Error('Category not found');
    category.addSection(section);
    this.addDomainEvent(new SectionAddedEvent(this.id, categoryId, section.id));
  }

  public linkItemToSection(categoryId: string, sectionId: string, itemRef: MenuItemReference): void {
    const category = this.categories.find(c => c.id === categoryId);
    if (!category) throw new Error('Category not found');
    const section = category.sections.find(s => s.id === sectionId);
    if (!section) throw new Error('Section not found');
    
    section.linkItem(itemRef);
    this.addDomainEvent(new MenuItemLinkedEvent(this.id, sectionId, itemRef.itemId));
  }
}