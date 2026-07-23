import { Menu } from '../aggregates/menu.aggregate';
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
    expect(() => menu.publish()).toThrow(/at least one category/);
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
    expect(() => menu.addCategory(cat2)).toThrow(/Unique Category names/);
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
    expect(() => cat.addSection(sec2)).toThrow(/Section name.*must be unique/);
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
    expect(() => menu.updateCode(MenuCode.create('NEW-CODE'))).toThrow(/Immutable MenuCode after publication/);
  });
});