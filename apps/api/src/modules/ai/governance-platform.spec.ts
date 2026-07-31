/**
 * Enterprise AI Governance & Certification Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Risk Assessment Scoring, PII Safety Filters, Policy Enforcement,
 * Audit Logs, Cost Control Dashboards, and Enterprise AI Platform Certification.
 */

import { RiskScore, SafetyClassification } from './domain/value-objects/governance-vo';
import { PolicyType, PolicyStatus, RiskLevel } from './domain/enums/governance.enums';
import { GovernancePolicyAggregate } from './domain/models/governance-policy.aggregate';
import { InMemoryGovernanceRepository } from './infrastructure/repositories/in-memory-governance.repository';
import { NestEventPublisherAdapter } from '../integration/infrastructure/adapters/connector.adapters';
import {
  PolicyService,
  SafetyService,
  EnterpriseGovernancePlatformService,
} from './application/services/governance-platform.services';

describe('Enterprise AI Governance & Certification Platform', () => {
  describe('Value Objects & Safety Filters', () => {
    it('should calculate RiskScore levels accurately', () => {
      const low = RiskScore.calculate(20);
      expect(low.level).toBe(RiskLevel.LOW);

      const med = RiskScore.calculate(45);
      expect(med.level).toBe(RiskLevel.MEDIUM);

      const high = RiskScore.calculate(70);
      expect(high.level).toBe(RiskLevel.HIGH);

      const critical = RiskScore.calculate(90);
      expect(critical.level).toBe(RiskLevel.CRITICAL);
    });

    it('should evaluate PII in text using SafetyClassification', () => {
      const clean = SafetyClassification.evaluate('What is the recipe for Margherita Pizza?');
      expect(clean.containsPii).toBe(false);
      expect(clean.isSafe).toBe(true);

      const piiText = SafetyClassification.evaluate('Customer SSN is 123-45-6789');
      expect(piiText.containsPii).toBe(true);
      expect(piiText.isSafe).toBe(false);
    });
  });

  describe('GovernancePolicyAggregate Root', () => {
    it('should create and activate governance policy aggregate', () => {
      const policy = GovernancePolicyAggregate.create({
        name: 'Strict Token Budget Policy',
        description: 'Enforce maximum 5,000 monthly USD AI budget ceiling',
        policyType: PolicyType.COST_POLICY,
        riskLevel: RiskLevel.HIGH,
      });

      expect(policy.getStatus()).toBe(PolicyStatus.DRAFT);

      policy.activate();
      expect(policy.getStatus()).toBe(PolicyStatus.ACTIVE);

      policy.recordViolation('Monthly token budget exceeded for tenant');
      expect(policy.getViolationsCount()).toBe(1);
    });
  });

  describe('Governance Platform Services & Platform Certification', () => {
    let repo: InMemoryGovernanceRepository;
    let publisherAdapter: NestEventPublisherAdapter;
    let policyService: PolicyService;
    let safetyService: SafetyService;
    let governanceService: EnterpriseGovernancePlatformService;

    beforeEach(() => {
      repo = new InMemoryGovernanceRepository();
      publisherAdapter = new NestEventPublisherAdapter();
      policyService = new PolicyService(repo);
      safetyService = new SafetyService();

      governanceService = new EnterpriseGovernancePlatformService(
        repo,
        publisherAdapter,
        policyService,
        safetyService
      );
    });

    it('should create policy, query audit logs, cost dashboards, and certify AI platform', async () => {
      // 1. Create Policy
      const policy = await governanceService.createPolicy('tenant-main', {
        name: 'PII Protection & Anonymization Policy',
        description: 'Block PII data in prompts and tool inputs',
        policyType: PolicyType.PRIVACY_POLICY,
        riskLevel: RiskLevel.CRITICAL,
      });

      expect(policy.status).toBe(PolicyStatus.ACTIVE);

      // 2. Certify Platform
      const certification = await governanceService.certifyPlatform('tenant-main', {
        certifiedBy: 'chief-information-security-officer',
        environment: 'production',
      });

      expect(certification.status).toBe('ENTERPRISE_CERTIFIED');
      expect(certification.overallScore).toBe(100.0);

      // 3. Query Governance Read Models
      const catalog = await governanceService.getPolicies('tenant-main');
      expect(catalog.totalPolicies).toBe(1);

      const audit = await governanceService.getAuditHistory('tenant-main');
      expect(audit.totalAudits).toBeGreaterThan(0);

      const costs = await governanceService.getCostDashboard();
      expect(costs.monthlyLimitUsd).toBe(5000.0);

      const risks = await governanceService.getRiskDashboard();
      expect(risks.overallRiskLevel).toBe(RiskLevel.LOW);
    });
  });
});
