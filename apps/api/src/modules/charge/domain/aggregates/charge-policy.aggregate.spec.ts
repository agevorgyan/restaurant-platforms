import { ChargePolicy } from './charge-policy.aggregate';
import { ChargePolicyId } from '../value-objects/charge-policy-id.value-object';
import { ChargeCode } from '../value-objects/charge-code.value-object';
import { ChargeName } from '../value-objects/charge-name.value-object';
import { ChargeType, ChargeTypeEnum } from '../value-objects/charge-type.value-object';
import { ChargeMethod, ChargeMethodEnum } from '../value-objects/charge-method.value-object';
import { ChargeAmount } from '../value-objects/charge-amount.value-object';
import { ChargeRule } from '../entities/charge-rule.entity';
import { ChargeTarget, ChargeTargetType } from '../entities/charge-target.entity';
import { ChargeCondition, ChargeConditionType } from '../entities/charge-condition.entity';
import { ChargeSchedule } from '../entities/charge-schedule.entity';
import { ChargePublicationPolicy } from '../policies/charge-publication.policy';
import { ChargeCalculationPolicy, ChargeEvaluationContext } from '../policies/charge-calculation.policy';
import { ChargeConditionSpecification } from '../specifications/charge-condition.specification';
import { ChargeScheduleSpecification } from '../specifications/charge-schedule.specification';
import { Money } from '../../../finance/domain/value-objects/money.value-object';
import { Currency } from '../../../finance/domain/value-objects/currency.value-object';
import { CurrencyCode } from '../../../finance/domain/value-objects/currency-code.enum';
import { EffectivePeriod } from '../value-objects/effective-period.value-object';

describe('ChargePolicy Aggregate', () => {
  let id: ChargePolicyId;
  let code: ChargeCode;
  let name: ChargeName;
  let policy: ChargePolicy;

  beforeEach(() => {
    id = ChargePolicyId.create('policy-123');
    code = ChargeCode.create('DELIVERY-FEE');
    name = ChargeName.create('Standard Delivery Fee');
    policy = ChargePolicy.create(id, code, name);
  });

  describe('Invariants', () => {
    it('should be created in DRAFT state', () => {
      expect(policy.status.value).toBe('DRAFT');
    });

    it('should prevent activation if no rules exist', () => {
      expect(() => policy.activate()).toThrow('Charge policy must contain at least one charge rule to activate');
    });

    it('should allow activation when valid', () => {
      const target = ChargeTarget.create('t1', { type: ChargeTargetType.DELIVERY });
      const condition = ChargeCondition.create('c1', { type: ChargeConditionType.ORDER_TOTAL, operator: 'GREATER_THAN', value: 0 });
      const amount = ChargeAmount.fromMoney(Money.create(500, Currency.create(CurrencyCode.USD, 2)));
      
      const rule = ChargeRule.create('rule-1', { 
        method: ChargeMethod.create(ChargeMethodEnum.FIXED_AMOUNT),
        type: ChargeType.create(ChargeTypeEnum.DELIVERY_FEE),
        amount,
        targets: [target],
        conditions: [condition],
        schedules: []
      });
      policy.addRule(rule);
      policy.activate();
      
      expect(policy.status.isActive()).toBe(true);
    });

    it('should prevent modification once published', () => {
      const target = ChargeTarget.create('t1', { type: ChargeTargetType.DELIVERY });
      const condition = ChargeCondition.create('c1', { type: ChargeConditionType.ORDER_TOTAL, operator: 'GREATER_THAN', value: 0 });
      const amount = ChargeAmount.fromMoney(Money.create(500, Currency.create(CurrencyCode.USD, 2)));
      
      const rule = ChargeRule.create('rule-1', { 
        method: ChargeMethod.create(ChargeMethodEnum.FIXED_AMOUNT),
        type: ChargeType.create(ChargeTypeEnum.DELIVERY_FEE),
        amount,
        targets: [target],
        conditions: [condition],
        schedules: []
      });
      policy.addRule(rule);
      policy.publish();

      const rule2 = ChargeRule.create('rule-2', { 
        method: ChargeMethod.create(ChargeMethodEnum.FIXED_AMOUNT),
        type: ChargeType.create(ChargeTypeEnum.DELIVERY_FEE),
        amount,
        targets: [target],
        conditions: [condition],
        schedules: []
      });
      expect(() => policy.addRule(rule2)).toThrow('Cannot add rules to a published policy. Create a new version.');
      expect(() => policy.setEffectivePeriod(EffectivePeriod.create(new Date()))).toThrow('Cannot modify effective period of a published policy');
    });
  });

  describe('Policies and Specifications', () => {
    it('should publish successfully using policy', () => {
      const pubPolicy = new ChargePublicationPolicy();
      
      expect(pubPolicy.canPublish(policy)).toBe(false);

      const target = ChargeTarget.create('t1', { type: ChargeTargetType.DELIVERY });
      const condition = ChargeCondition.create('c1', { type: ChargeConditionType.ORDER_TOTAL, operator: 'GREATER_THAN', value: 0 });
      const amount = ChargeAmount.fromMoney(Money.create(500, Currency.create(CurrencyCode.USD, 2)));
      
      const rule = ChargeRule.create('rule-1', { 
        method: ChargeMethod.create(ChargeMethodEnum.FIXED_AMOUNT),
        type: ChargeType.create(ChargeTypeEnum.DELIVERY_FEE),
        amount,
        targets: [target],
        conditions: [condition],
        schedules: []
      });
      
      policy.addRule(rule);
      expect(pubPolicy.canPublish(policy)).toBe(true);
    });

    it('should evaluate applicable rules based on conditions and schedules', () => {
      const target = ChargeTarget.create('t1', { type: ChargeTargetType.DELIVERY });
      // Condition: Order total > 1000 ($10.00)
      const condition = ChargeCondition.create('c1', { type: ChargeConditionType.ORDER_TOTAL, operator: 'GREATER_THAN', value: 1000 });
      
      // Schedule: Only applies on Mondays (1)
      const schedule = ChargeSchedule.create('s1', { daysOfWeek: [1] });

      const amount = ChargeAmount.fromMoney(Money.create(500, Currency.create(CurrencyCode.USD, 2)));
      const rule = ChargeRule.create('rule-1', { 
        method: ChargeMethod.create(ChargeMethodEnum.FIXED_AMOUNT),
        type: ChargeType.create(ChargeTypeEnum.DELIVERY_FEE),
        amount,
        targets: [target],
        conditions: [condition],
        schedules: [schedule]
      });
      
      policy.addRule(rule);

      const calcPolicy = new ChargeCalculationPolicy(
        new ChargeConditionSpecification(),
        new ChargeScheduleSpecification()
      );

      // Create a mock Monday date
      const monday = new Date('2023-10-16T12:00:00Z'); // October 16, 2023 was a Monday

      const context: ChargeEvaluationContext = {
        conditions: {
          [ChargeConditionType.ORDER_TOTAL]: 1500, // Meets > 1000
          [ChargeConditionType.DELIVERY_DISTANCE]: 5,
          [ChargeConditionType.WEIGHT]: 0,
          [ChargeConditionType.QUANTITY]: 1,
          [ChargeConditionType.CUSTOMER_TIER]: 'REGULAR',
          [ChargeConditionType.TIME_WINDOW]: null,
          [ChargeConditionType.DAY_OF_WEEK]: null,
          [ChargeConditionType.RESTAURANT]: null,
          [ChargeConditionType.BRANCH]: null,
          [ChargeConditionType.SALES_CHANNEL]: null
        },
        targets: {
          [ChargeTargetType.ENTIRE_ORDER]: [],
          [ChargeTargetType.DELIVERY]: ['true'], // Matches Delivery target
          [ChargeTargetType.PICKUP]: [],
          [ChargeTargetType.DINE_IN]: [],
          [ChargeTargetType.PRODUCT]: [],
          [ChargeTargetType.CATEGORY]: [],
          [ChargeTargetType.RESTAURANT]: [],
          [ChargeTargetType.BRANCH]: []
        },
        evaluationDate: monday
      };

      const applicableRules = calcPolicy.evaluateApplicableRules(policy, context);
      expect(applicableRules.length).toBe(1);
    });
  });
});
