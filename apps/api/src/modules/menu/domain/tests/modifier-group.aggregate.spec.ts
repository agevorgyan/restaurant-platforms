import { ModifierGroup } from '../aggregates/modifier-group.aggregate';
import { ModifierGroupId } from '../value-objects/modifier-group-id.value-object';
import { ModifierGroupName } from '../value-objects/modifier-group-name.value-object';
import { ModifierGroupCode } from '../value-objects/modifier-group-code.value-object';
import { ModifierGroupDescription } from '../value-objects/modifier-group-description.value-object';
import { ModifierGroupStatus, SelectionMode } from '../enums/modifier-group.enums';
import { ModifierVersion } from '../value-objects/modifier-version.value-object';
import { ModifierConstraint } from '../entities/modifier-constraint.entity';
import { MinimumSelection } from '../value-objects/minimum-selection.value-object';
import { MaximumSelection } from '../value-objects/maximum-selection.value-object';
import { SelectionRule } from '../entities/selection-rule.entity';
import { ModifierDisplayConfiguration } from '../entities/modifier-display-configuration.entity';
import { ModifierTranslation } from '../entities/modifier-translation.entity';
import { ModifierOption } from '../entities/modifier-option.entity';
import { ModifierOptionName } from '../value-objects/modifier-option-name.value-object';
import { DisplayOrder } from '../value-objects/display-order.value-object';

describe('ModifierGroup Aggregate', () => {
  const baseProps = {
    id: ModifierGroupId.create('mg-1'),
    name: ModifierGroupName.create('Extras'),
    code: ModifierGroupCode.create('EXT-1'),
    description: ModifierGroupDescription.create('Extra toppings'),
    status: ModifierGroupStatus.DRAFT,
    version: ModifierVersion.create(1),
    options: [],
    constraint: ModifierConstraint.create({
      id: 'mc-1',
      minSelection: MinimumSelection.create(0),
      maxSelection: MaximumSelection.create(5)
    }),
    rule: SelectionRule.create({ id: 'sr-1', mode: SelectionMode.MULTIPLE, isRequired: false }),
    displayConfig: ModifierDisplayConfiguration.create({ id: 'mdc-1', columns: 1, hideIfUnavailable: false }),
    translations: []
  };

  it('should create modifier group in draft state', () => {
    const group = ModifierGroup.create(baseProps);
    expect(group.status).toBe(ModifierGroupStatus.DRAFT);
  });

  it('should enforce immutable code after publication', () => {
    const group = ModifierGroup.create(baseProps);
    group.addTranslation(ModifierTranslation.create({ id: 't-1', languageCode: 'en', displayName: 'Extras' }));
    group.publish();
    expect(() => group.updateCode(ModifierGroupCode.create('EXT-2'))).toThrow(/Immutable ModifierGroupCode/);
  });

  it('should enforce unique option names', () => {
    const group = ModifierGroup.create(baseProps);
    const opt1 = ModifierOption.create({ id: 'mo-1', name: ModifierOptionName.create('Cheese'), displayOrder: DisplayOrder.create(1), isAvailable: true });
    const opt2 = ModifierOption.create({ id: 'mo-2', name: ModifierOptionName.create('Cheese'), displayOrder: DisplayOrder.create(2), isAvailable: true });
    
    group.addOption(opt1);
    expect(() => group.addOption(opt2)).toThrow(/Duplicate option name/);
  });

  it('should validate min and max selection constraints', () => {
    expect(() => MinimumSelection.create(-1)).toThrow(/must be >= 0/);
    expect(() => ModifierConstraint.create({
      id: 'mc-err',
      minSelection: MinimumSelection.create(2),
      maxSelection: MaximumSelection.create(1)
    })).toThrow(/MaximumSelection must be >= MinimumSelection/);
  });

  it('should enforce required groups must allow at least one selection', () => {
    const group = ModifierGroup.create(baseProps);
    const rule = SelectionRule.create({ id: 'sr-2', mode: SelectionMode.MULTIPLE, isRequired: true });
    const constraint = ModifierConstraint.create({
      id: 'mc-2',
      minSelection: MinimumSelection.create(0),
      maxSelection: MaximumSelection.create(5)
    });
    
    expect(() => group.updateSelectionRule(rule, constraint)).toThrow(/Required groups must have MinimumSelection > 0/);
  });
});