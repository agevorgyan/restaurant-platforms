import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { NutritionValue } from './nutrition-value.value-object';
import { ServingInformation } from './serving-information.value-object';
import { Allergen } from './allergen.value-object';
import { DietaryTag } from './dietary-tag.value-object';
import { NutritionFacts } from './nutrition-facts.value-object';

describe('Product Nutrition Domain Value Objects', () => {
  describe('NutritionValue', () => {
    it('should create a valid nutrition value', () => {
      const val = new NutritionValue(10.5, 'g');
      assert.strictEqual(val.value, 10.5);
      assert.strictEqual(val.unit, 'g');
    });

    it('should throw if value is negative', () => {
      assert.throws(() => new NutritionValue(-1, 'g'), /Nutrition values cannot be negative/);
    });

    it('should throw on invalid unit', () => {
      assert.throws(() => new NutritionValue(10, 'kg'), /Invalid measurement unit/);
    });
  });

  describe('ServingInformation', () => {
    it('should create valid serving information', () => {
      const info = new ServingInformation(150, 2, 'g');
      assert.strictEqual(info.servingSize, 150);
      assert.strictEqual(info.servingsPerContainer, 2);
    });

    it('should throw if serving size is zero or less', () => {
      assert.throws(() => new ServingInformation(0, 1, 'g'), /Serving size must be greater than zero/);
      assert.throws(() => new ServingInformation(-5, 1, 'g'), /Serving size must be greater than zero/);
    });

    it('should throw if servings per container is negative', () => {
      assert.throws(() => new ServingInformation(100, -1, 'g'), /Servings per container cannot be negative/);
    });
  });

  describe('Allergen', () => {
    it('should create a valid allergen', () => {
      const allergen = new Allergen('Milk');
      assert.strictEqual(allergen.value, 'Milk');
    });

    it('should throw on invalid allergen', () => {
      // @ts-expect-error Testing invalid cast
      assert.throws(() => new Allergen('Apples'), /Invalid allergen/);
    });
  });

  describe('DietaryTag', () => {
    it('should create a valid dietary tag', () => {
      const tag = new DietaryTag('Vegan');
      assert.strictEqual(tag.value, 'Vegan');
    });

    it('should throw on invalid dietary tag', () => {
      // @ts-expect-error Testing invalid cast
      assert.throws(() => new DietaryTag('Keto'), /Invalid dietary tag/);
    });
  });

  describe('NutritionFacts', () => {
    it('should create valid nutrition facts', () => {
      const servingInfo = new ServingInformation(100, 1, 'g');
      const calories = new NutritionValue(250, 'kcal');
      const facts = new NutritionFacts(servingInfo, calories);
      assert.strictEqual(facts.calories.value, 250);
    });
  });
});
