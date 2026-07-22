import * as assert from 'node:assert';
import {
  IngredientCreatedEvent,
  IngredientUpdatedEvent,
  IngredientActivatedEvent,
  IngredientArchivedEvent
} from './events/ingredient.events';
import {
  InventoryAdjustmentCreatedEvent,
  InventoryAdjustmentApprovedEvent,
  InventoryAdjustmentRejectedEvent,
  InventoryAdjustmentPostedEvent,
  InventoryAdjustmentCancelledEvent
} from './events/inventory-adjustment.events';
import {
  InventoryCreatedEvent,
  InventoryUpdatedEvent,
  InventoryActivatedEvent,
  InventoryDeactivatedEvent
} from './events/inventory.events';
import {
  RecipeCreatedEvent,
  RecipeUpdatedEvent,
  RecipeActivatedEvent,
  RecipeArchivedEvent
} from './events/recipe.events';
import {
  StockCountCreatedEvent,
  StockCountStartedEvent,
  StockCountCompletedEvent,
  StockCountApprovedEvent,
  StockCountCancelledEvent
} from './events/stock-count.events';
import {
  StockMovementCreatedEvent,
  StockMovementPostedEvent,
  StockMovementCancelledEvent
} from './events/stock-movement.events';

describe('Inventory Domain Events', () => {
  it('Ingredient events should instantiate correctly with readonly properties', () => {
    const created = new IngredientCreatedEvent('ing1', 'res1');
    assert.strictEqual(created.ingredientId, 'ing1');
    assert.strictEqual(created.restaurantId, 'res1');

    const updated = new IngredientUpdatedEvent('ing1', 'res1');
    assert.strictEqual(updated.ingredientId, 'ing1');

    const activated = new IngredientActivatedEvent('ing1', 'res1');
    assert.strictEqual(activated.ingredientId, 'ing1');

    const archived = new IngredientArchivedEvent('ing1', 'res1');
    assert.strictEqual(archived.ingredientId, 'ing1');
  });

  it('InventoryAdjustment events should instantiate correctly with readonly properties', () => {
    const created = new InventoryAdjustmentCreatedEvent('adj1', 'res1');
    assert.strictEqual(created.adjustmentId, 'adj1');

    const approved = new InventoryAdjustmentApprovedEvent('adj1', 'res1');
    assert.strictEqual(approved.adjustmentId, 'adj1');

    const rejected = new InventoryAdjustmentRejectedEvent('adj1', 'res1');
    assert.strictEqual(rejected.adjustmentId, 'adj1');

    const posted = new InventoryAdjustmentPostedEvent('adj1', 'res1');
    assert.strictEqual(posted.adjustmentId, 'adj1');

    const cancelled = new InventoryAdjustmentCancelledEvent('adj1', 'res1');
    assert.strictEqual(cancelled.adjustmentId, 'adj1');
  });

  it('Inventory events should instantiate correctly with readonly properties', () => {
    const created = new InventoryCreatedEvent('inv1', 'res1');
    assert.strictEqual(created.inventoryId, 'inv1');

    const updated = new InventoryUpdatedEvent('inv1', 'res1');
    assert.strictEqual(updated.inventoryId, 'inv1');

    const activated = new InventoryActivatedEvent('inv1', 'res1');
    assert.strictEqual(activated.inventoryId, 'inv1');

    const deactivated = new InventoryDeactivatedEvent('inv1', 'res1');
    assert.strictEqual(deactivated.inventoryId, 'inv1');
  });

  it('Recipe events should instantiate correctly with readonly properties', () => {
    const created = new RecipeCreatedEvent('rec1', 'res1');
    assert.strictEqual(created.recipeId, 'rec1');

    const updated = new RecipeUpdatedEvent('rec1', 'res1');
    assert.strictEqual(updated.recipeId, 'rec1');

    const activated = new RecipeActivatedEvent('rec1', 'res1');
    assert.strictEqual(activated.recipeId, 'rec1');

    const archived = new RecipeArchivedEvent('rec1', 'res1');
    assert.strictEqual(archived.recipeId, 'rec1');
  });

  it('StockCount events should instantiate correctly with readonly properties', () => {
    const created = new StockCountCreatedEvent('cnt1', 'res1');
    assert.strictEqual(created.countId, 'cnt1');

    const started = new StockCountStartedEvent('cnt1', 'res1');
    assert.strictEqual(started.countId, 'cnt1');

    const completed = new StockCountCompletedEvent('cnt1', 'res1');
    assert.strictEqual(completed.countId, 'cnt1');

    const approved = new StockCountApprovedEvent('cnt1', 'res1');
    assert.strictEqual(approved.countId, 'cnt1');

    const cancelled = new StockCountCancelledEvent('cnt1', 'res1');
    assert.strictEqual(cancelled.countId, 'cnt1');
  });

  it('StockMovement events should instantiate correctly with readonly properties', () => {
    const created = new StockMovementCreatedEvent('mov1', 'res1');
    assert.strictEqual(created.movementId, 'mov1');

    const posted = new StockMovementPostedEvent('mov1', 'res1');
    assert.strictEqual(posted.movementId, 'mov1');

    const cancelled = new StockMovementCancelledEvent('mov1', 'res1');
    assert.strictEqual(cancelled.movementId, 'mov1');
  });
});
