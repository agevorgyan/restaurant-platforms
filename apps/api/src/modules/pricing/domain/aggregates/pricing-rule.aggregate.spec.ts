import { PricingRule } from './pricing-rule.aggregate';
import { PricingRuleId } from '../value-objects/pricing-rule-id.value-object';
import { PricingRuleCode } from '../value-objects/pricing-rule-code.value-object';
import { PricingRuleName } from '../value-objects/pricing-rule-name.value-object';
import { PricingRuleType, PricingRuleTypeEnum } from '../value-objects/pricing-rule-type.value-object';
import { PricingRuleScope, PricingRuleScopeEnum } from '../value-objects/pricing-rule-scope.value-object';
import { PricingRuleTarget, PricingRuleTargetEnum } from '../value-objects/pricing-rule-target.value-object';
import { PricingRulePriority } from '../value-objects/pricing-rule-priority.value-object';

import { PricingCondition, PricingConditionType } from '../entities/pricing-condition.entity';
import { PricingAction, PricingActionType } from '../entities/pricing-action.entity';
import { PricingPriority } from '../entities/pricing-priority.entity';
import { PricingPublicationPolicy } from '../policies/pricing-publication.policy';
import { PricingRuleValiditySpecification } from '../specifications/pricing-rule-validity.specification';
import { PricingRuleApplicabilitySpecification } from '../specifications/pricing-rule-applicability.specification';
import { PricingRuleConflictSpecification } from '../specifications/pricing-rule-conflict.specification';
import { PricingConflictResolutionPolicy } from '../policies/pricing-conflict-resolution.policy';
import { PricingEvaluationPolicy } from '../policies/pricing-evaluation.policy';

describe('PricingRule Aggregate', () => {
  let id: PricingRuleId;
  let code: PricingRuleCode;
  let name: PricingRuleName;
  let type: PricingRuleType;
  let scope: PricingRuleScope;
  let target: PricingRuleTarget;
  let rule: PricingRule;

  beforeEach(() => {
    id = PricingRuleId.create('rule-123');
    code = PricingRuleCode.create('SUMMER-SALE');
    name = PricingRuleName.create('Summer Sale Rule');
    type = PricingRuleType.create(PricingRuleTypeEnum.PERCENTAGE_ADJUSTMENT);
    scope = PricingRuleScope.create(PricingRuleScopeEnum.GLOBAL);
    target = PricingRuleTarget.create(PricingRuleTargetEnum.ORDER);

    rule = PricingRule.create(id, code, name, type, scope, target);
  });

  describe('Invariants', () => {
    it('should be created in DRAFT state with version 1', () => {
      expect(rule.status.value).toBe('DRAFT');
      expect(rule.version.value).toBe(1);
    });

    it('should prevent adding multiple actions', () => {
      const action = PricingAction.create('a1', { type: PricingActionType.REDUCE_PRICE, value: 10 });
      const action2 = PricingAction.create('a2', { type: PricingActionType.LOCK_PRICE, value: 20 });
      
      rule.addAction(action);
      expect(() => rule.addAction(action2)).toThrow('A pricing rule must contain exactly one action');
    });

    it('should prevent activation if invalid', () => {
      expect(() => rule.activate()).toThrow('Rule must be valid (have conditions and one action) to activate');
      
      // Add condition only
      const cond = PricingCondition.create('c1', { type: PricingConditionType.ORDER_CHANNEL, operator: 'EQUALS', value: 'WEB' });
      rule.addCondition(cond);
      expect(() => rule.activate()).toThrow('Rule must be valid (have conditions and one action) to activate');

      // Add action
      const action = PricingAction.create('a1', { type: PricingActionType.REDUCE_PRICE, value: 10 });
      rule.addAction(action);
      rule.activate();
      
      expect(rule.status.isActive()).toBe(true);
    });

    it('should prevent modification once archived', () => {
      rule.archive();
      expect(rule.status.isArchived()).toBe(true);

      const action = PricingAction.create('a1', { type: PricingActionType.REDUCE_PRICE, value: 10 });
      expect(() => rule.addAction(action)).toThrow('Cannot modify an archived rule');
    });
  });

  describe('Publication & Evaluation', () => {
    it('should publish successfully', () => {
      const validitySpec = new PricingRuleValiditySpecification();
      const pubPolicy = new PricingPublicationPolicy(validitySpec);
      
      expect(pubPolicy.canPublish(rule)).toBe(false);

      rule.addCondition(PricingCondition.create('c1', { type: PricingConditionType.ORDER_CHANNEL, operator: 'EQUALS', value: 'WEB' }));
      rule.addAction(PricingAction.create('a1', { type: PricingActionType.REDUCE_PRICE, value: 10 }));

      expect(pubPolicy.canPublish(rule)).toBe(true);
      rule.publish();
      expect(rule.version.value).toBe(2);
    });

    it('should evaluate applicable rules using deterministic ordering', () => {
      const rule2 = PricingRule.create(PricingRuleId.create('rule-456'), PricingRuleCode.create('WINTER-SALE'), name, type, scope, target);
      
      const cond = PricingCondition.create('c1', { type: PricingConditionType.ORDER_CHANNEL, operator: 'EQUALS', value: 'WEB' });
      const action = PricingAction.create('a1', { type: PricingActionType.REDUCE_PRICE, value: 10 });
      
      rule.addCondition(cond);
      rule.addAction(action);
      rule.activate();
      rule.setPriority(PricingPriority.create('p1', { priority: PricingRulePriority.create(1), weight: 100, conflictResolutionStrategy: 'STRICT_ORDER' }));

      rule2.addCondition(cond);
      rule2.addAction(action);
      rule2.activate();
      rule2.setPriority(PricingPriority.create('p2', { priority: PricingRulePriority.create(2), weight: 200, explicitOrder: 1, conflictResolutionStrategy: 'STRICT_ORDER' }));

      const evalPolicy = new PricingEvaluationPolicy(
        new PricingRuleApplicabilitySpecification(),
        new PricingRuleConflictSpecification(),
        new PricingConflictResolutionPolicy()
      );

      // Rule2 has higher weight (200) and an explicit order of 1, so it should be prioritized.
      const resolved = evalPolicy.evaluate([rule, rule2], {});
      expect(resolved.length).toBe(2);
      expect(resolved[0].code.value).toBe('WINTER-SALE');
      expect(resolved[1].code.value).toBe('SUMMER-SALE');
    });
  });
});
