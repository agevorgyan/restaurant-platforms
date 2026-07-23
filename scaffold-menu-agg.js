const fs = require('fs');
const path = require('path');

const domainDir = '/Users/apple/Downloads/Projects/Restaurant Platform/restaurant-platforms/apps/api/src/modules/menu/domain';

const dirsToCreate = [
  'aggregates',
  'entities',
  'events',
  'policies',
  'specifications',
  'value-objects',
  'tests'
];

dirsToCreate.forEach(dir => {
  fs.mkdirSync(path.join(domainDir, dir), { recursive: true });
});

const filesToCreate = {
  // Enums update
  'enums/menu.enums.ts': `export enum MenuStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export enum MenuItemStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum MenuCategoryStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum ModifierGroupStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum AvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}

export enum VisibilityStatus {
  VISIBLE = 'VISIBLE',
  HIDDEN = 'HIDDEN',
  RESTRICTED = 'RESTRICTED'
}`,

  // Value Objects
  'value-objects/menu-name.value-object.ts': `import { ValueObject } from '@saas/core';

export interface MenuNameProps { value: string; }

export class MenuName extends ValueObject<MenuNameProps> {
  get value(): string { return this.props.value; }
  private constructor(props: MenuNameProps) { super(props); }
  public static create(value: string): MenuName {
    if (!value || value.trim().length === 0) throw new Error('MenuName cannot be empty');
    return new MenuName({ value: value.trim() });
  }
}`,

  'value-objects/menu-code.value-object.ts': `import { ValueObject } from '@saas/core';

export interface MenuCodeProps { value: string; }

export class MenuCode extends ValueObject<MenuCodeProps> {
  get value(): string { return this.props.value; }
  private constructor(props: MenuCodeProps) { super(props); }
  public static create(value: string): MenuCode {
    if (!value || value.trim().length === 0) throw new Error('MenuCode cannot be empty');
    return new MenuCode({ value: value.trim().toUpperCase() });
  }
}`,

  'value-objects/menu-description.value-object.ts': `import { ValueObject } from '@saas/core';

export interface MenuDescriptionProps { value: string; }

export class MenuDescription extends ValueObject<MenuDescriptionProps> {
  get value(): string { return this.props.value; }
  private constructor(props: MenuDescriptionProps) { super(props); }
  public static create(value: string): MenuDescription {
    return new MenuDescription({ value: value.trim() });
  }
}`,

  'value-objects/menu-item-reference.value-object.ts': `import { ValueObject } from '@saas/core';

export interface MenuItemReferenceProps { itemId: string; }

export class MenuItemReference extends ValueObject<MenuItemReferenceProps> {
  get itemId(): string { return this.props.itemId; }
  private constructor(props: MenuItemReferenceProps) { super(props); }
  public static create(itemId: string): MenuItemReference {
    if (!itemId) throw new Error('MenuItemReference cannot be empty');
    return new MenuItemReference({ itemId });
  }
}`,

  'value-objects/menu-category-reference.value-object.ts': `import { ValueObject } from '@saas/core';

export interface MenuCategoryReferenceProps { categoryId: string; }

export class MenuCategoryReference extends ValueObject<MenuCategoryReferenceProps> {
  get categoryId(): string { return this.props.categoryId; }
  private constructor(props: MenuCategoryReferenceProps) { super(props); }
  public static create(categoryId: string): MenuCategoryReference {
    if (!categoryId) throw new Error('MenuCategoryReference cannot be empty');
    return new MenuCategoryReference({ categoryId });
  }
}`,

  'value-objects/menu-section-reference.value-object.ts': `import { ValueObject } from '@saas/core';

export interface MenuSectionReferenceProps { sectionId: string; }

export class MenuSectionReference extends ValueObject<MenuSectionReferenceProps> {
  get sectionId(): string { return this.props.sectionId; }
  private constructor(props: MenuSectionReferenceProps) { super(props); }
  public static create(sectionId: string): MenuSectionReference {
    if (!sectionId) throw new Error('MenuSectionReference cannot be empty');
    return new MenuSectionReference({ sectionId });
  }
}`,

  'value-objects/visibility-period.value-object.ts': `import { ValueObject } from '@saas/core';

export interface VisibilityPeriodProps {
  startDate: Date;
  endDate?: Date;
}

export class VisibilityPeriod extends ValueObject<VisibilityPeriodProps> {
  get startDate(): Date { return this.props.startDate; }
  get endDate(): Date | undefined { return this.props.endDate; }

  private constructor(props: VisibilityPeriodProps) { super(props); }

  public static create(startDate: Date, endDate?: Date): VisibilityPeriod {
    if (endDate && startDate >= endDate) {
      throw new Error('StartDate must be before EndDate');
    }
    return new VisibilityPeriod({ startDate, endDate });
  }
}`,

  'value-objects/display-priority.value-object.ts': `import { ValueObject } from '@saas/core';

export interface DisplayPriorityProps { priority: number; }

export class DisplayPriority extends ValueObject<DisplayPriorityProps> {
  get priority(): number { return this.props.priority; }
  private constructor(props: DisplayPriorityProps) { super(props); }
  public static create(priority: number): DisplayPriority {
    if (priority < 0) throw new Error('DisplayPriority must be non-negative');
    return new DisplayPriority({ priority });
  }
}`,

  // Entities
  'entities/menu-section.entity.ts': `import { Entity } from '@saas/core';
import { MenuName } from '../value-objects/menu-name.value-object';
import { DisplayOrder } from '../value-objects/display-order.value-object';
import { MenuItemReference } from '../value-objects/menu-item-reference.value-object';

export interface MenuSectionProps {
  id: string;
  name: MenuName;
  displayOrder: DisplayOrder;
  items: MenuItemReference[];
}

export class MenuSection extends Entity<MenuSectionProps> {
  get id(): string { return this.props.id; }
  get name(): MenuName { return this.props.name; }
  get displayOrder(): DisplayOrder { return this.props.displayOrder; }
  get items(): MenuItemReference[] { return this.props.items; }

  public linkItem(item: MenuItemReference): void {
    if (this.props.items.some(i => i.itemId === item.itemId)) {
      throw new Error(\`Item \${item.itemId} is already linked to section \${this.name.value}\`);
    }
    this.props.items.push(item);
  }

  public unlinkItem(itemId: string): void {
    this.props.items = this.props.items.filter(i => i.itemId !== itemId);
  }

  public static create(props: MenuSectionProps): MenuSection {
    return new MenuSection(props);
  }
}`,

  'entities/menu-category.entity.ts': `import { Entity } from '@saas/core';
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
      throw new Error(\`Section name \${section.name.value} must be unique within Category\`);
    }
    this.props.sections.push(section);
  }

  public removeSection(sectionId: string): void {
    this.props.sections = this.props.sections.filter(s => s.id !== sectionId);
  }

  public static create(props: MenuCategoryProps): MenuCategory {
    return new MenuCategory(props);
  }
}`,

  'entities/menu-layout.entity.ts': `import { Entity } from '@saas/core';

export interface MenuLayoutProps {
  id: string;
  theme: string;
  columns: number;
}

export class MenuLayout extends Entity<MenuLayoutProps> {
  get id(): string { return this.props.id; }
  get theme(): string { return this.props.theme; }
  get columns(): number { return this.props.columns; }

  public static create(props: MenuLayoutProps): MenuLayout {
    return new MenuLayout(props);
  }
}`,

  'entities/menu-visibility-rule.entity.ts': `import { Entity } from '@saas/core';
import { VisibilityPeriod } from '../value-objects/visibility-period.value-object';

export interface MenuVisibilityRuleProps {
  id: string;
  period: VisibilityPeriod;
  isGloballyVisible: boolean;
}

export class MenuVisibilityRule extends Entity<MenuVisibilityRuleProps> {
  get id(): string { return this.props.id; }
  get period(): VisibilityPeriod { return this.props.period; }
  get isGloballyVisible(): boolean { return this.props.isGloballyVisible; }

  public static create(props: MenuVisibilityRuleProps): MenuVisibilityRule {
    return new MenuVisibilityRule(props);
  }
}`,

  'entities/display-configuration.entity.ts': `import { Entity } from '@saas/core';
import { DisplayPriority } from '../value-objects/display-priority.value-object';

export interface DisplayConfigurationProps {
  id: string;
  priority: DisplayPriority;
  isFeatured: boolean;
}

export class DisplayConfiguration extends Entity<DisplayConfigurationProps> {
  get id(): string { return this.props.id; }
  get priority(): DisplayPriority { return this.props.priority; }
  get isFeatured(): boolean { return this.props.isFeatured; }

  public static create(props: DisplayConfigurationProps): DisplayConfiguration {
    return new DisplayConfiguration(props);
  }
}`,

  // Events
  'events/menu.events.ts': `import { DomainEvent } from '@saas/core';

export class MenuCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class MenuPublishedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class MenuActivatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class MenuArchivedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class CategoryAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string, public readonly categoryId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class CategoryRemovedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string, public readonly categoryId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class SectionAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string, public readonly categoryId: string, public readonly sectionId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class SectionRemovedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string, public readonly categoryId: string, public readonly sectionId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class MenuItemLinkedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string, public readonly sectionId: string, public readonly itemId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class MenuItemUnlinkedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string, public readonly sectionId: string, public readonly itemId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class VisibilityChangedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class LayoutUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string) {}
  getAggregateId(): string { return this.menuId; }
}`,

  // Specifications
  'specifications/menu-aggregate.specifications.ts': `import { Menu } from '../aggregates/menu.aggregate';
import { MenuStatus } from '../enums/menu.enums';

export class MenuConsistencySpecification {
  public static isSatisfiedBy(menu: Menu): boolean {
    // Unique category names
    const names = menu.categories.map(c => c.name.value);
    const uniqueNames = new Set(names);
    if (names.length !== uniqueNames.size) return false;
    
    // Check sections inside categories
    for (const cat of menu.categories) {
      const secNames = cat.sections.map(s => s.name.value);
      if (secNames.length !== new Set(secNames).size) return false;
    }
    return true;
  }
}

export class MenuVisibilitySpecification {
  public static isVisible(menu: Menu): boolean {
    return menu.status === MenuStatus.PUBLISHED || menu.status === MenuStatus.ACTIVE;
  }
}

export class MenuLayoutSpecification {
  public static isValid(layout: any): boolean {
    return !!layout;
  }
}

export class CategorySpecification {
  public static isValid(category: any): boolean {
    // Category cannot be empty
    return category && category.sections && category.sections.length > 0;
  }
}

export class SectionSpecification {
  public static isValid(section: any): boolean {
    return section && section.displayOrder.order >= 0;
  }
}`,

  // Policies
  'policies/menu-aggregate.policies.ts': `import { Menu } from '../aggregates/menu.aggregate';
import { MenuStatus } from '../enums/menu.enums';

export class MenuLifecyclePolicy {
  public static canPublish(menu: Menu): boolean {
    if (menu.status !== MenuStatus.DRAFT) return false;
    if (menu.categories.length === 0) return false;
    return true;
  }

  public static canActivate(menu: Menu): boolean {
    return menu.status === MenuStatus.PUBLISHED;
  }
}

export class MenuValidationPolicy {
  public static ensureImmutableCodeAfterPublish(oldStatus: MenuStatus, newStatus: MenuStatus): void {
    // handled inside aggregate logic
  }
}

export class VisibilityPolicy {
  public static canBeVisible(status: MenuStatus): boolean {
    return status === MenuStatus.PUBLISHED || status === MenuStatus.ACTIVE;
  }
}

export class LayoutPolicy {
  public static validate(): void {
    // stub
  }
}`,

  // Aggregate Root
  'aggregates/menu.aggregate.ts': `import { AggregateRoot } from '@saas/core';
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
  CategoryAddedEvent, CategoryRemovedEvent, SectionAddedEvent, SectionRemovedEvent,
  MenuItemLinkedEvent, MenuItemUnlinkedEvent
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
  get id(): MenuId { return this.props.id; }
  get name(): MenuName { return this.props.name; }
  get code(): MenuCode { return this.props.code; }
  get description(): MenuDescription { return this.props.description; }
  get status(): MenuStatus { return this.props.status; }
  get version(): MenuVersion { return this.props.version; }
  get categories(): MenuCategory[] { return this.props.categories; }

  private constructor(props: MenuProps) {
    super(props);
  }

  public static create(props: MenuProps): Menu {
    const menu = new Menu({ ...props, status: MenuStatus.DRAFT });
    menu.addDomainEvent(new MenuCreatedEvent(menu.id.value));
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
    this.addDomainEvent(new MenuPublishedEvent(this.id.value));
  }

  public activate(): void {
    if (!MenuLifecyclePolicy.canActivate(this)) {
      throw new Error('Menu must be PUBLISHED before it can be ACTIVE');
    }
    this.props.status = MenuStatus.ACTIVE;
    this.addDomainEvent(new MenuActivatedEvent(this.id.value));
  }

  public archive(): void {
    this.props.status = MenuStatus.ARCHIVED;
    this.addDomainEvent(new MenuArchivedEvent(this.id.value));
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
    this.addDomainEvent(new CategoryAddedEvent(this.id.value, category.id));
    if (!MenuConsistencySpecification.isSatisfiedBy(this)) {
      this.props.categories.pop();
      throw new Error('Menu consistency violated');
    }
  }

  public addSectionToCategory(categoryId: string, section: MenuSection): void {
    const category = this.categories.find(c => c.id === categoryId);
    if (!category) throw new Error('Category not found');
    category.addSection(section);
    this.addDomainEvent(new SectionAddedEvent(this.id.value, categoryId, section.id));
  }

  public linkItemToSection(categoryId: string, sectionId: string, itemRef: MenuItemReference): void {
    const category = this.categories.find(c => c.id === categoryId);
    if (!category) throw new Error('Category not found');
    const section = category.sections.find(s => s.id === sectionId);
    if (!section) throw new Error('Section not found');
    
    section.linkItem(itemRef);
    this.addDomainEvent(new MenuItemLinkedEvent(this.id.value, sectionId, itemRef.itemId));
  }
}`,

  // Tests
  'tests/menu.aggregate.spec.ts': `import { Menu } from '../aggregates/menu.aggregate';
import { MenuId } from '../value-objects/menu-id.value-object';
import { MenuName } from '../value-objects/menu-name.value-object';
import { MenuCode } from '../value-objects/menu-code.value-object';
import { MenuDescription } from '../value-objects/menu-description.value-object';
import { MenuStatus } from '../enums/menu.enums';
import { MenuVersion } from '../value-objects/menu-version.value-object';
import { MenuCategory } from '../entities/menu-category.entity';
import { DisplayOrder } from '../value-objects/display-order.value-object';
import { MenuLayout } from '../entities/menu-layout.entity';
import { DisplayConfiguration } from '../entities/display-configuration.entity';
import { DisplayPriority } from '../value-objects/display-priority.value-object';
import { MenuSection } from '../entities/menu-section.entity';
import { MenuItemReference } from '../value-objects/menu-item-reference.value-object';

describe('Menu Aggregate', () => {
  it('should create menu in draft state', () => {
    const menu = Menu.create({
      id: MenuId.create('m1'),
      name: MenuName.create('Dinner'),
      code: MenuCode.create('DINNER-1'),
      description: MenuDescription.create('Dinner Menu'),
      status: MenuStatus.DRAFT,
      version: MenuVersion.create(1),
      categories: [],
      layout: MenuLayout.create({ id: 'l1', theme: 'dark', columns: 2 }),
      visibilityRules: [],
      displayConfig: DisplayConfiguration.create({ id: 'dc1', priority: DisplayPriority.create(1), isFeatured: true })
    });
    expect(menu.status).toBe(MenuStatus.DRAFT);
    expect(menu.domainEvents.length).toBe(1);
  });

  it('should not publish if empty', () => {
    const menu = Menu.create({
      id: MenuId.create('m1'),
      name: MenuName.create('Dinner'),
      code: MenuCode.create('DINNER-1'),
      description: MenuDescription.create('Dinner Menu'),
      status: MenuStatus.DRAFT,
      version: MenuVersion.create(1),
      categories: [],
      layout: MenuLayout.create({ id: 'l1', theme: 'dark', columns: 2 }),
      visibilityRules: [],
      displayConfig: DisplayConfiguration.create({ id: 'dc1', priority: DisplayPriority.create(1), isFeatured: true })
    });
    expect(() => menu.publish()).toThrowError(/at least one category/);
  });

  it('should enforce unique category names', () => {
    const menu = Menu.create({
      id: MenuId.create('m1'),
      name: MenuName.create('Dinner'),
      code: MenuCode.create('DINNER-1'),
      description: MenuDescription.create('Dinner Menu'),
      status: MenuStatus.DRAFT,
      version: MenuVersion.create(1),
      categories: [],
      layout: MenuLayout.create({ id: 'l1', theme: 'dark', columns: 2 }),
      visibilityRules: [],
      displayConfig: DisplayConfiguration.create({ id: 'dc1', priority: DisplayPriority.create(1), isFeatured: true })
    });

    const cat1 = MenuCategory.create({
      id: 'c1',
      name: MenuName.create('Starters'),
      displayOrder: DisplayOrder.create(1),
      sections: []
    });

    const cat2 = MenuCategory.create({
      id: 'c2',
      name: MenuName.create('Starters'),
      displayOrder: DisplayOrder.create(2),
      sections: []
    });

    menu.addCategory(cat1);
    expect(() => menu.addCategory(cat2)).toThrowError(/Unique Category names/);
  });
  
  it('should enforce unique section names within category', () => {
    const cat = MenuCategory.create({
      id: 'c1',
      name: MenuName.create('Starters'),
      displayOrder: DisplayOrder.create(1),
      sections: []
    });

    const sec1 = MenuSection.create({
      id: 's1',
      name: MenuName.create('Cold Starters'),
      displayOrder: DisplayOrder.create(1),
      items: []
    });

    const sec2 = MenuSection.create({
      id: 's2',
      name: MenuName.create('Cold Starters'),
      displayOrder: DisplayOrder.create(2),
      items: []
    });

    cat.addSection(sec1);
    expect(() => cat.addSection(sec2)).toThrowError(/Section name.*must be unique/);
  });

  it('should enforce immutable menu code after publish', () => {
    const menu = Menu.create({
      id: MenuId.create('m1'),
      name: MenuName.create('Dinner'),
      code: MenuCode.create('DINNER-1'),
      description: MenuDescription.create('Dinner Menu'),
      status: MenuStatus.DRAFT,
      version: MenuVersion.create(1),
      categories: [],
      layout: MenuLayout.create({ id: 'l1', theme: 'dark', columns: 2 }),
      visibilityRules: [],
      displayConfig: DisplayConfiguration.create({ id: 'dc1', priority: DisplayPriority.create(1), isFeatured: true })
    });
    
    const sec1 = MenuSection.create({
      id: 's1',
      name: MenuName.create('Cold Starters'),
      displayOrder: DisplayOrder.create(1),
      items: [MenuItemReference.create('item-1')]
    });
    const cat1 = MenuCategory.create({
      id: 'c1',
      name: MenuName.create('Starters'),
      displayOrder: DisplayOrder.create(1),
      sections: [sec1]
    });
    
    menu.addCategory(cat1);
    menu.publish();
    expect(() => menu.updateCode(MenuCode.create('NEW-CODE'))).toThrowError(/Immutable MenuCode after publication/);
  });
});`
};

Object.keys(filesToCreate).forEach(relPath => {
  const fullPath = path.join(domainDir, relPath);
  fs.writeFileSync(fullPath, filesToCreate[relPath]);
  console.log('Created:', fullPath);
});
