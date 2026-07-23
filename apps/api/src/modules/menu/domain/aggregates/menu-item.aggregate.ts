import { AggregateRoot } from '@saas/core';
import { MenuItemId } from '../value-objects/menu-item-id.value-object';
import { MenuItemName } from '../value-objects/menu-item-name.value-object';
import { MenuItemCode } from '../value-objects/menu-item-code.value-object';
import { MenuItemDescription } from '../value-objects/menu-item-description.value-object';
import { MenuItemLifecycleStatus, MenuItemType } from '../enums/menu-item.enums';
import { MenuItemVersion } from '../value-objects/menu-item-version.value-object';
import { SKU } from '../value-objects/sku.value-object';
import { Barcode } from '../value-objects/barcode.value-object';
import { PreparationLabel } from '../value-objects/preparation-label.value-object';
import { DisplayName } from '../value-objects/display-name.value-object';
import { SEOName } from '../value-objects/seo-name.value-object';
import { RecipeReference } from '../value-objects/recipe-reference.value-object';
import { PriceReference } from '../value-objects/price-reference.value-object';
import { InventoryItemReference } from '../value-objects/inventory-item-reference.value-object';
import { KitchenStationReference } from '../value-objects/kitchen-station-reference.value-object';
import { ModifierGroupReference } from '../value-objects/modifier-group-reference.value-object';
import { TaxCategoryReference } from '../value-objects/tax-category-reference.value-object';

import { MenuItemImage } from '../entities/menu-item-image.entity';
import { MenuItemNutrition } from '../entities/menu-item-nutrition.entity';
import { MenuItemAllergen } from '../entities/menu-item-allergen.entity';
import { MenuItemTag } from '../entities/menu-item-tag.entity';
import { MenuItemTranslation } from '../entities/menu-item-translation.entity';
import { MenuItemAvailabilityOverride } from '../entities/menu-item-availability-override.entity';

import { 
  MenuItemCreatedEvent, MenuItemPublishedEvent, MenuItemAvailableEvent,
  MenuItemUnavailableEvent, MenuItemArchivedEvent, AllergensUpdatedEvent,
  TranslationAddedEvent, ReferenceLinkedEvent
} from '../events/menu-item.events';

import { MenuItemConsistencySpecification } from '../specifications/menu-item.specifications';
import { MenuItemLifecyclePolicy } from '../policies/menu-item.policies';

export interface MenuItemProps {
  id: MenuItemId;
  name: MenuItemName;
  code: MenuItemCode;
  description: MenuItemDescription;
  status: MenuItemLifecycleStatus;
  type: MenuItemType;
  version: MenuItemVersion;
  sku: SKU;
  barcode?: Barcode;
  preparationLabel?: PreparationLabel;
  displayName: DisplayName;
  seoName?: SEOName;

  recipeRef?: RecipeReference;
  priceRef?: PriceReference;
  inventoryItemRef?: InventoryItemReference;
  kitchenStationRef?: KitchenStationReference;
  modifierGroupRefs: ModifierGroupReference[];
  taxCategoryRef?: TaxCategoryReference;

  images: MenuItemImage[];
  nutrition?: MenuItemNutrition;
  allergens: MenuItemAllergen[];
  tags: MenuItemTag[];
  translations: MenuItemTranslation[];
  availabilityOverrides: MenuItemAvailabilityOverride[];
}

export class MenuItem extends AggregateRoot<MenuItemProps> {
  get name(): MenuItemName { return this.props.name; }
  get code(): MenuItemCode { return this.props.code; }
  get description(): MenuItemDescription { return this.props.description; }
  get status(): MenuItemLifecycleStatus { return this.props.status; }
  get type(): MenuItemType { return this.props.type; }
  get version(): MenuItemVersion { return this.props.version; }
  get sku(): SKU { return this.props.sku; }
  get displayName(): DisplayName { return this.props.displayName; }

  get recipeRef(): RecipeReference | undefined { return this.props.recipeRef; }
  get priceRef(): PriceReference | undefined { return this.props.priceRef; }
  get inventoryItemRef(): InventoryItemReference | undefined { return this.props.inventoryItemRef; }
  get kitchenStationRef(): KitchenStationReference | undefined { return this.props.kitchenStationRef; }
  get modifierGroupRefs(): ModifierGroupReference[] { return this.props.modifierGroupRefs; }
  get taxCategoryRef(): TaxCategoryReference | undefined { return this.props.taxCategoryRef; }

  get images(): MenuItemImage[] { return this.props.images; }
  get nutrition(): MenuItemNutrition | undefined { return this.props.nutrition; }
  get allergens(): MenuItemAllergen[] { return this.props.allergens; }
  get tags(): MenuItemTag[] { return this.props.tags; }
  get translations(): MenuItemTranslation[] { return this.props.translations; }
  get availabilityOverrides(): MenuItemAvailabilityOverride[] { return this.props.availabilityOverrides; }

  private constructor(props: MenuItemProps) {
    super(props.id.value, props);
  }

  public static create(props: MenuItemProps): MenuItem {
    const item = new MenuItem({ ...props, status: MenuItemLifecycleStatus.DRAFT });
    item.addDomainEvent(new MenuItemCreatedEvent(item.id));
    return item;
  }

  public publish(): void {
    if (!MenuItemLifecyclePolicy.canPublish(this)) {
      throw new Error('MenuItem cannot be published');
    }
    if (!MenuItemConsistencySpecification.isSatisfiedBy(this)) {
      throw new Error('MenuItem consistency violated');
    }
    this.props.status = MenuItemLifecycleStatus.PUBLISHED;
    this.addDomainEvent(new MenuItemPublishedEvent(this.id));
  }

  public makeAvailable(): void {
    if (!MenuItemLifecyclePolicy.canMakeAvailable(this)) {
      throw new Error('MenuItem must be published first to become available');
    }
    this.props.status = MenuItemLifecycleStatus.AVAILABLE;
    this.addDomainEvent(new MenuItemAvailableEvent(this.id));
  }

  public makeUnavailable(): void {
    this.props.status = MenuItemLifecycleStatus.UNAVAILABLE;
    this.addDomainEvent(new MenuItemUnavailableEvent(this.id));
  }

  public archive(): void {
    this.props.status = MenuItemLifecycleStatus.ARCHIVED;
    this.addDomainEvent(new MenuItemArchivedEvent(this.id));
  }

  public updateCode(code: MenuItemCode): void {
    if (this.status !== MenuItemLifecycleStatus.DRAFT) {
      throw new Error('Immutable MenuItemCode after publication');
    }
    this.props.code = code;
  }

  public addTranslation(translation: MenuItemTranslation): void {
    if (this.translations.some(t => t.languageCode === translation.languageCode)) {
      throw new Error('Duplicate translation language');
    }
    this.props.translations.push(translation);
    this.addDomainEvent(new TranslationAddedEvent(this.id, translation.id));
  }

  public addAllergen(allergen: MenuItemAllergen): void {
    if (this.allergens.some(a => a.allergenName === allergen.allergenName)) {
      throw new Error('Duplicate allergen entry');
    }
    this.props.allergens.push(allergen);
    this.addDomainEvent(new AllergensUpdatedEvent(this.id));
  }

  public linkPrice(priceRef: PriceReference): void {
    this.props.priceRef = priceRef;
    this.addDomainEvent(new ReferenceLinkedEvent(this.id, 'PRICE'));
  }
}