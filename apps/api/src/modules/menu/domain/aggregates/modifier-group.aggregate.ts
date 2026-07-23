import { AggregateRoot } from '@saas/core';
import { ModifierGroupId } from '../value-objects/modifier-group-id.value-object';
import { ModifierGroupName } from '../value-objects/modifier-group-name.value-object';
import { ModifierGroupCode } from '../value-objects/modifier-group-code.value-object';
import { ModifierGroupDescription } from '../value-objects/modifier-group-description.value-object';
import { ModifierGroupStatus } from '../enums/modifier-group.enums';
import { ModifierVersion } from '../value-objects/modifier-version.value-object';
import { ModifierOption } from '../entities/modifier-option.entity';
import { ModifierConstraint } from '../entities/modifier-constraint.entity';
import { SelectionRule } from '../entities/selection-rule.entity';
import { ModifierDisplayConfiguration } from '../entities/modifier-display-configuration.entity';
import { ModifierTranslation } from '../entities/modifier-translation.entity';

import { 
  ModifierGroupCreatedEvent, ModifierGroupPublishedEvent, ModifierGroupActivatedEvent,
  ModifierGroupDeactivatedEvent, ModifierGroupArchivedEvent, ModifierOptionAddedEvent,
  ModifierTranslationAddedEvent
} from '../events/modifier-group.events';

import { ModifierGroupConsistencySpecification, ModifierSelectionSpecification } from '../specifications/modifier-group.specifications';
import { ModifierLifecyclePolicy, SelectionPolicy } from '../policies/modifier-group.policies';

export interface ModifierGroupProps {
  id: ModifierGroupId;
  name: ModifierGroupName;
  code: ModifierGroupCode;
  description: ModifierGroupDescription;
  status: ModifierGroupStatus;
  version: ModifierVersion;
  
  options: ModifierOption[];
  constraint: ModifierConstraint;
  rule: SelectionRule;
  displayConfig: ModifierDisplayConfiguration;
  translations: ModifierTranslation[];
}

export class ModifierGroup extends AggregateRoot<ModifierGroupProps> {
  get name(): ModifierGroupName { return this.props.name; }
  get code(): ModifierGroupCode { return this.props.code; }
  get description(): ModifierGroupDescription { return this.props.description; }
  get status(): ModifierGroupStatus { return this.props.status; }
  get version(): ModifierVersion { return this.props.version; }

  get options(): ModifierOption[] { return this.props.options; }
  get constraint(): ModifierConstraint { return this.props.constraint; }
  get rule(): SelectionRule { return this.props.rule; }
  get displayConfig(): ModifierDisplayConfiguration { return this.props.displayConfig; }
  get translations(): ModifierTranslation[] { return this.props.translations; }

  private constructor(props: ModifierGroupProps) {
    super(props.id.value, props);
  }

  public static create(props: ModifierGroupProps): ModifierGroup {
    const group = new ModifierGroup({ ...props, status: ModifierGroupStatus.DRAFT });
    group.addDomainEvent(new ModifierGroupCreatedEvent(group.id));
    return group;
  }

  public publish(): void {
    if (!ModifierLifecyclePolicy.canPublish(this)) {
      throw new Error('ModifierGroup cannot be published. Needs translations and must be in DRAFT state.');
    }
    if (!ModifierGroupConsistencySpecification.isSatisfiedBy(this)) {
      throw new Error('ModifierGroup consistency violated');
    }
    if (!ModifierSelectionSpecification.isSatisfiedBy(this)) {
      throw new Error('Modifier selection constraints violated');
    }
    this.props.status = ModifierGroupStatus.PUBLISHED;
    this.addDomainEvent(new ModifierGroupPublishedEvent(this.id));
  }

  public activate(): void {
    if (!ModifierLifecyclePolicy.canActivate(this)) {
      throw new Error('ModifierGroup must be PUBLISHED or INACTIVE first to become ACTIVE');
    }
    this.props.status = ModifierGroupStatus.ACTIVE;
    this.addDomainEvent(new ModifierGroupActivatedEvent(this.id));
  }

  public deactivate(): void {
    this.props.status = ModifierGroupStatus.INACTIVE;
    this.addDomainEvent(new ModifierGroupDeactivatedEvent(this.id));
  }

  public archive(): void {
    this.props.status = ModifierGroupStatus.ARCHIVED;
    this.addDomainEvent(new ModifierGroupArchivedEvent(this.id));
  }

  public updateCode(code: ModifierGroupCode): void {
    if (this.status !== ModifierGroupStatus.DRAFT) {
      throw new Error('Immutable ModifierGroupCode after publication');
    }
    this.props.code = code;
  }

  public addOption(option: ModifierOption): void {
    if (this.options.some(o => o.name.value === option.name.value)) {
      throw new Error('Duplicate option name');
    }
    this.props.options.push(option);
    this.addDomainEvent(new ModifierOptionAddedEvent(this.id, option.id));
  }

  public addTranslation(translation: ModifierTranslation): void {
    if (this.translations.some(t => t.languageCode === translation.languageCode)) {
      throw new Error('Duplicate translation language');
    }
    this.props.translations.push(translation);
    this.addDomainEvent(new ModifierTranslationAddedEvent(this.id, translation.id));
  }

  public updateSelectionRule(rule: SelectionRule, constraint: ModifierConstraint): void {
    this.props.rule = rule;
    this.props.constraint = constraint;
    SelectionPolicy.enforce(this);
  }
}