import { TaxPolicy } from './tax-policy.aggregate';
import { TaxPolicyId } from '../value-objects/tax-policy-id.value-object';
import { TaxCode } from '../value-objects/tax-code.value-object';
import { TaxName } from '../value-objects/tax-name.value-object';
import { TaxType, TaxTypeEnum } from '../value-objects/tax-type.value-object';
import { TaxRate } from '../value-objects/tax-rate.value-object';
import { TaxRule } from '../entities/tax-rule.entity';
import { TaxJurisdiction, TaxJurisdictionType } from '../entities/tax-jurisdiction.entity';
import { TaxCategory, TaxCategoryType } from '../entities/tax-category.entity';
import { TaxExemption, TaxExemptionType } from '../entities/tax-exemption.entity';
import { TaxPublicationPolicy } from '../policies/tax-publication.policy';
import { TaxCalculationPolicy, TaxEvaluationContext } from '../policies/tax-calculation.policy';
import { TaxJurisdictionSpecification } from '../specifications/tax-jurisdiction.specification';
import { TaxExemptionSpecification } from '../specifications/tax-exemption.specification';
import { EffectivePeriod } from '../value-objects/effective-period.value-object';

describe('TaxPolicy Aggregate', () => {
  let id: TaxPolicyId;
  let code: TaxCode;
  let name: TaxName;
  let policy: TaxPolicy;

  beforeEach(() => {
    id = TaxPolicyId.create('policy-123');
    code = TaxCode.create('VAT-STANDARD');
    name = TaxName.create('Standard VAT Policy');
    policy = TaxPolicy.create(id, code, name);
  });

  describe('Invariants', () => {
    it('should be created in DRAFT state', () => {
      expect(policy.status.value).toBe('DRAFT');
    });

    it('should prevent activation if no rules exist', () => {
      expect(() => policy.activate()).toThrow('Tax policy must contain at least one tax rule to activate');
    });

    it('should allow activation when valid', () => {
      const jurisdiction = TaxJurisdiction.create('j1', { type: TaxJurisdictionType.COUNTRY, value: 'US' });
      const category = TaxCategory.create('c1', { type: TaxCategoryType.ENTIRE_ORDER });
      const rate = TaxRate.create(10);
      const type = TaxType.create(TaxTypeEnum.VAT);
      
      const rule = TaxRule.create('rule-1', { rate, type, jurisdictions: [jurisdiction], categories: [category] });
      policy.addRule(rule);
      policy.activate();
      
      expect(policy.status.isActive()).toBe(true);
    });

    it('should prevent modification once published', () => {
      const jurisdiction = TaxJurisdiction.create('j1', { type: TaxJurisdictionType.COUNTRY, value: 'US' });
      const category = TaxCategory.create('c1', { type: TaxCategoryType.ENTIRE_ORDER });
      const rate = TaxRate.create(10);
      const type = TaxType.create(TaxTypeEnum.VAT);
      
      const rule = TaxRule.create('rule-1', { rate, type, jurisdictions: [jurisdiction], categories: [category] });
      policy.addRule(rule);
      policy.publish();

      const rule2 = TaxRule.create('rule-2', { rate, type, jurisdictions: [jurisdiction], categories: [category] });
      expect(() => policy.addRule(rule2)).toThrow('Cannot add rules to a published policy. Create a new version.');
      expect(() => policy.setEffectivePeriod(EffectivePeriod.create(new Date()))).toThrow('Cannot modify effective period of a published policy');
    });
  });

  describe('Policies and Specifications', () => {
    it('should publish successfully using policy', () => {
      const pubPolicy = new TaxPublicationPolicy();
      
      expect(pubPolicy.canPublish(policy)).toBe(false);

      const jurisdiction = TaxJurisdiction.create('j1', { type: TaxJurisdictionType.COUNTRY, value: 'US' });
      const category = TaxCategory.create('c1', { type: TaxCategoryType.ENTIRE_ORDER });
      const rule = TaxRule.create('rule-1', { rate: TaxRate.create(10), type: TaxType.create(TaxTypeEnum.VAT), jurisdictions: [jurisdiction], categories: [category] });
      
      policy.addRule(rule);
      expect(pubPolicy.canPublish(policy)).toBe(true);
    });

    it('should evaluate exemptions correctly', () => {
      const jurisdiction = TaxJurisdiction.create('j1', { type: TaxJurisdictionType.COUNTRY, value: 'US' });
      const category = TaxCategory.create('c1', { type: TaxCategoryType.ENTIRE_ORDER });
      const rule = TaxRule.create('rule-1', { rate: TaxRate.create(10), type: TaxType.create(TaxTypeEnum.VAT), jurisdictions: [jurisdiction], categories: [category] });
      
      policy.addRule(rule);
      
      // Add exemption for customer 'cust-vip'
      const exemption = TaxExemption.create('e1', { type: TaxExemptionType.CUSTOMER, value: 'cust-vip', reason: 'VIP No Tax' });
      policy.addExemption(exemption);

      const calcPolicy = new TaxCalculationPolicy(
        new TaxJurisdictionSpecification(),
        new TaxExemptionSpecification()
      );

      const context: TaxEvaluationContext = {
        jurisdictions: {
          [TaxJurisdictionType.COUNTRY]: 'US',
          [TaxJurisdictionType.REGION]: '',
          [TaxJurisdictionType.CITY]: '',
          [TaxJurisdictionType.RESTAURANT]: '',
          [TaxJurisdictionType.BRANCH]: ''
        },
        categories: {
          [TaxCategoryType.PRODUCT]: [],
          [TaxCategoryType.MENU_CATEGORY]: [],
          [TaxCategoryType.DELIVERY]: [],
          [TaxCategoryType.SERVICE_FEE]: [],
          [TaxCategoryType.PACKAGING]: [],
          [TaxCategoryType.ENTIRE_ORDER]: ['true']
        },
        exemptions: {
          [TaxExemptionType.CUSTOMER]: ['cust-vip'], // Matches exemption
          [TaxExemptionType.PRODUCT]: [],
          [TaxExemptionType.CATEGORY]: [],
          [TaxExemptionType.RESTAURANT]: []
        }
      };

      const applicableRules = calcPolicy.evaluateApplicableRules(policy, context);
      expect(applicableRules.length).toBe(0); // Because of the exemption
    });
  });
});
