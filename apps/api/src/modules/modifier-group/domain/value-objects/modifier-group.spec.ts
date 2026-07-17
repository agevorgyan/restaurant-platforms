import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { ModifierGroupStatus } from './modifier-group-status.value-object';
import { ModifierSelectionRules } from './modifier-selection-rules.value-object';

describe('Modifier Group Domain Value Objects', () => {
  describe('ModifierGroupStatus', () => {
    it('should create valid statuses', () => {
      const active = new ModifierGroupStatus('Active');
      const archived = new ModifierGroupStatus('Archived');
      
      assert.strictEqual(active.value, 'Active');
      assert.strictEqual(archived.value, 'Archived');
      assert.strictEqual(archived.isArchived(), true);
      assert.strictEqual(active.isArchived(), false);
    });

    it('should throw on invalid status', () => {
      // @ts-expect-error Testing invalid cast
      assert.throws(() => new ModifierGroupStatus('InvalidStatus'));
    });
  });

  describe('ModifierSelectionRules', () => {
    it('should create valid selection rules', () => {
      const rules = new ModifierSelectionRules('Multiple', 1, 5, true, true);
      assert.strictEqual(rules.selectionType, 'Multiple');
      assert.strictEqual(rules.minimumSelections, 1);
      assert.strictEqual(rules.maximumSelections, 5);
      assert.strictEqual(rules.isRequired, true);
      assert.strictEqual(rules.allowMultipleSelections, true);
    });

    it('should throw if minimumSelections is negative', () => {
      assert.throws(() => new ModifierSelectionRules('Multiple', -1, 5, false, true), /minimumSelections cannot be negative/);
    });

    it('should throw if maximumSelections is less than minimumSelections', () => {
      assert.throws(() => new ModifierSelectionRules('Multiple', 2, 1, false, true), /maximumSelections must be greater than or equal to minimumSelections/);
    });

    it('should throw if selectionType is Single but maximumSelections is not 1', () => {
      assert.throws(() => new ModifierSelectionRules('Single', 0, 2, false, false), /If selectionType is Single, maximumSelections must equal 1/);
    });

    it('should allow Single selectionType with maximumSelections exactly 1', () => {
      const rules = new ModifierSelectionRules('Single', 0, 1, false, false);
      assert.strictEqual(rules.selectionType, 'Single');
      assert.strictEqual(rules.maximumSelections, 1);
    });
    
    it('should throw on invalid selectionType', () => {
      // @ts-expect-error Testing invalid cast
      assert.throws(() => new ModifierSelectionRules('InvalidType', 0, 1, false, false));
    });
  });
});
