import { DiscountPolicy, DiscountPolicyStatus } from './discount-policy.aggregate';
import { DiscountPolicyId } from '../value-objects/discount-policy-id.value-object';
import { DiscountType, DiscountTypeEnum } from '../value-objects/discount-type.value-object';
import { DiscountPriority } from '../value-objects/discount-priority.value-object';
import { DiscountScope, DiscountScopeEnum } from '../value-objects/discount-scope.value-object';
import { DiscountRule } from '../entities/discount-rule.entity';
import { DiscountCondition } from '../entities/discount-condition.entity';
import { DiscountBenefit } from '../entities/discount-benefit.entity';
import { DiscountPercentage } from '../value-objects/discount-percentage.value-object';

describe('DiscountPolicy Aggregate', () => {
  let policyId: DiscountPolicyId;
  let type: DiscountType;
  let priority: DiscountPriority;
  let scope: DiscountScope;
  let condition: DiscountCondition;
  let benefit: DiscountBenefit;
  let rule: DiscountRule;

  beforeEach(() => {
    policyId = DiscountPolicyId.create('dp-1');
    type = DiscountType.create(DiscountTypeEnum.PERCENTAGE);
    priority = DiscountPriority.create(1);
    scope = DiscountScope.create(DiscountScopeEnum.ORDER);
    
    condition = DiscountCondition.create('cond-1', { minOrderAmount: 100 });
    benefit = DiscountBenefit.createPercentage('ben-1', DiscountPercentage.create(10));
    rule = DiscountRule.create('rule-1', '10% off > $100', condition, benefit);
  });

  describe('Creation', () => {
    it('should create a valid discount policy in Draft status', () => {
      const policy = DiscountPolicy.create(
        policyId,
        'Summer Sale',
        type,
        priority,
        scope,
        true
      );
      
      expect(policy.policyId.value).toBe('dp-1');
      expect(policy.name).toBe('Summer Sale');
      expect(policy.status).toBe(DiscountPolicyStatus.DRAFT);
      expect(policy.isStackable).toBe(true);
      expect(policy.rules.length).toBe(0);
      expect(policy.domainEvents.length).toBe(1);
      expect(policy.domainEvents[0].constructor.name).toBe('DiscountPolicyCreated');
    });

    it('should throw an error if name is empty', () => {
      expect(() => DiscountPolicy.create(policyId, '', type, priority, scope))
        .toThrow('Discount policy name cannot be empty');
    });
  });

  describe('Rules Management', () => {
    let policy: DiscountPolicy;

    beforeEach(() => {
      policy = DiscountPolicy.create(policyId, 'Summer Sale', type, priority, scope);
    });

    it('should add a rule successfully', () => {
      policy.addRule(rule);
      expect(policy.rules.length).toBe(1);
      expect(policy.domainEvents[1].constructor.name).toBe('DiscountRuleAdded');
    });

    it('should prevent adding duplicate rule names', () => {
      policy.addRule(rule);
      expect(() => policy.addRule(rule)).toThrow('A rule with the same name already exists in this policy');
    });

    it('should remove a rule successfully', () => {
      policy.addRule(rule);
      policy.removeRule('rule-1');
      expect(policy.rules.length).toBe(0);
      expect(policy.domainEvents.some(e => e.constructor.name === 'DiscountRuleRemoved')).toBeTruthy();
    });
  });

  describe('Activation & Deactivation', () => {
    let policy: DiscountPolicy;

    beforeEach(() => {
      policy = DiscountPolicy.create(policyId, 'Summer Sale', type, priority, scope);
    });

    it('should not activate if it has no rules', () => {
      expect(() => policy.activate()).toThrow('Cannot activate a policy without any rules');
    });

    it('should activate a draft policy with rules', () => {
      policy.addRule(rule);
      policy.activate();
      expect(policy.status).toBe(DiscountPolicyStatus.ACTIVE);
      expect(policy.domainEvents.some(e => e.constructor.name === 'DiscountPolicyActivated')).toBeTruthy();
    });

    it('should automatically deactivate if last rule is removed while active', () => {
      policy.addRule(rule);
      policy.activate();
      policy.removeRule('rule-1');
      
      expect(policy.status).toBe(DiscountPolicyStatus.DRAFT);
      expect(policy.domainEvents.some(e => e.constructor.name === 'DiscountPolicyDeactivated')).toBeTruthy();
    });
  });

  describe('Archive', () => {
    let policy: DiscountPolicy;

    beforeEach(() => {
      policy = DiscountPolicy.create(policyId, 'Summer Sale', type, priority, scope);
      policy.addRule(rule);
      policy.activate();
    });

    it('should archive successfully and deactivate if active', () => {
      policy.archive();
      expect(policy.status).toBe(DiscountPolicyStatus.ARCHIVED);
      expect(policy.domainEvents.some(e => e.constructor.name === 'DiscountPolicyDeactivated')).toBeTruthy();
    });

    it('should throw an error when modifying rules of an archived policy', () => {
      policy.archive();
      expect(() => policy.addRule(DiscountRule.create('rule-2', 'test', condition, benefit)))
        .toThrow('Cannot modify rules of an archived policy');
      expect(() => policy.removeRule('rule-1'))
        .toThrow('Cannot modify rules of an archived policy');
    });
  });

  describe('Evaluation', () => {
    let policy: DiscountPolicy;

    beforeEach(() => {
      policy = DiscountPolicy.create(policyId, 'Summer Sale', type, priority, scope);
      policy.addRule(rule);
    });

    it('should not be applicable if not active', () => {
      const result = policy.evaluate({ orderAmount: 150 });
      expect(result.isApplicable).toBe(false);
      expect(result.applicableRules.length).toBe(0);
    });

    it('should be applicable if active and condition satisfied', () => {
      policy.activate();
      const result = policy.evaluate({ orderAmount: 150 });
      expect(result.isApplicable).toBe(true);
      expect(result.applicableRules.length).toBe(1);
    });

    it('should not be applicable if condition not satisfied', () => {
      policy.activate();
      const result = policy.evaluate({ orderAmount: 50 }); // Less than minOrderAmount of 100
      expect(result.isApplicable).toBe(false);
      expect(result.applicableRules.length).toBe(0);
    });
  });
});
