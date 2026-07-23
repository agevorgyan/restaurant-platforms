import { MenuItem } from '../aggregates/menu-item.aggregate';
import { MenuItemId } from '../value-objects/menu-item-id.value-object';
import { MenuItemName } from '../value-objects/menu-item-name.value-object';
import { MenuItemCode } from '../value-objects/menu-item-code.value-object';
import { MenuItemDescription } from '../value-objects/menu-item-description.value-object';
import { MenuItemLifecycleStatus, MenuItemType } from '../enums/menu-item.enums';
import { MenuItemVersion } from '../value-objects/menu-item-version.value-object';
import { SKU } from '../value-objects/sku.value-object';
import { DisplayName } from '../value-objects/display-name.value-object';
import { MenuItemTranslation } from '../entities/menu-item-translation.entity';
import { MenuItemAllergen } from '../entities/menu-item-allergen.entity';
import { PreparationLabel } from '../value-objects/preparation-label.value-object';

describe('MenuItem Aggregate', () => {
  const baseProps = {
    id: MenuItemId.create('mi-1'),
    name: MenuItemName.create('Burger'),
    code: MenuItemCode.create('BURG-1'),
    description: MenuItemDescription.create('Classic Burger'),
    status: MenuItemLifecycleStatus.DRAFT,
    type: MenuItemType.FOOD,
    version: MenuItemVersion.create(1),
    sku: SKU.create('SKU-BURG-1'),
    displayName: DisplayName.create('Classic Burger'),
    modifierGroupRefs: [],
    images: [],
    allergens: [],
    tags: [],
    translations: [],
    availabilityOverrides: []
  };

  it('should create menu item in draft state', () => {
    const item = MenuItem.create(baseProps);
    expect(item.status).toBe(MenuItemLifecycleStatus.DRAFT);
  });

  it('should enforce at least one translation for publication', () => {
    const item = MenuItem.create({ ...baseProps, translations: [] });
    expect(() => item.publish()).toThrow(/MenuItem cannot be published/);
    
    item.addTranslation(MenuItemTranslation.create({
      id: 't-1',
      languageCode: 'en',
      displayName: 'Burger'
    }));
    item.publish();
    expect(item.status).toBe(MenuItemLifecycleStatus.PUBLISHED);
  });

  it('should enforce immutable menu code after publication', () => {
    const item = MenuItem.create(baseProps);
    item.addTranslation(MenuItemTranslation.create({
      id: 't-1',
      languageCode: 'en',
      displayName: 'Burger'
    }));
    item.publish();
    expect(() => item.updateCode(MenuItemCode.create('NEW-CODE'))).toThrow(/Immutable MenuItemCode/);
  });

  it('should prevent duplicate allergens', () => {
    const item = MenuItem.create(baseProps);
    item.addAllergen(MenuItemAllergen.create({ id: 'a1', allergenName: 'Dairy', contains: true }));
    expect(() => item.addAllergen(MenuItemAllergen.create({ id: 'a2', allergenName: 'Dairy', contains: false }))).toThrow(/Duplicate allergen/);
  });

  it('should enforce positive preparation time', () => {
    expect(() => PreparationLabel.create(-5)).toThrow(/positive/);
    expect(() => PreparationLabel.create(0)).toThrow(/positive/);
    expect(() => PreparationLabel.create(10)).not.toThrow();
  });
});