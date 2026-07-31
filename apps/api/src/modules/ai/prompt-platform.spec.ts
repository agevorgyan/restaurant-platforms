/**
 * Enterprise Prompt Management Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Variable Extraction & Rendering Engine, Governance Approval Workflow,
 * Immutability Rules for Published Prompts, Evaluation Scoring, and Application Services.
 */

import {
  PromptVersion,
  PromptTemplate,
  PromptVariable,
} from './domain/value-objects/prompt-vo';
import { PromptType, PromptStatus, EvaluationStatus } from './domain/enums/prompt.enums';
import { PublishedPromptImmutableException, PromptApprovalException } from './domain/exceptions/prompt.exceptions';
import { PromptAggregate } from './domain/models/prompt.aggregate';
import { InMemoryPromptRepository } from './infrastructure/repositories/in-memory-prompt.repository';
import { NestEventPublisherAdapter } from '../integration/infrastructure/adapters/connector.adapters';
import {
  VariableService,
  TemplateService,
  EvaluationService,
  ApprovalService,
  EnterprisePromptPlatformService,
} from './application/services/prompt-platform.services';

describe('Enterprise Prompt Management Platform', () => {
  describe('Value Objects & Variable Extraction Engine', () => {
    it('should validate SemVer PromptVersion', () => {
      const ver = PromptVersion.create('2.1.0');
      expect(ver.getValue()).toBe('2.1.0');

      expect(() => PromptVersion.create('invalid_semver')).toThrow();
    });

    it('should extract placeholders and render prompt with variables', () => {
      const template = PromptTemplate.create(
        'Welcome to {{restaurantName}} in {{city}}! Special offer: {{discount}}% off.'
      );

      const variables = template.extractVariables();
      expect(variables).toEqual(['restaurantName', 'city', 'discount']);

      const rendered = template.render({
        restaurantName: 'Gourmet Bistro',
        city: 'San Francisco',
        discount: 20,
      });

      expect(rendered).toBe('Welcome to Gourmet Bistro in San Francisco! Special offer: 20% off.');
    });

    it('should throw exception when mandatory variable is missing during render', () => {
      const template = PromptTemplate.create('Hello {{userName}}, your order {{orderId}} is ready.');
      expect(() => template.render({ userName: 'Alice' })).toThrow();
    });
  });

  describe('PromptAggregate & Governance Approval Workflow', () => {
    it('should create prompt in DRAFT and advance through approval lifecycle', () => {
      const prompt = PromptAggregate.create({
        name: 'Order Confirmation Prompt',
        type: PromptType.SYSTEM_PROMPT,
        version: '1.0.0',
        templateText: 'Order {{orderId}} confirmed for {{customerName}}.',
        author: 'ai-team',
        description: 'Customer order confirmation prompt',
      });

      expect(prompt.getStatus()).toBe(PromptStatus.DRAFT);
      expect(prompt.getVariables().length).toBe(2);

      // 1. Submit for Review
      prompt.submitForReview('author-jane');
      expect(prompt.getStatus()).toBe(PromptStatus.REVIEW);

      // 2. Approve
      prompt.approve('lead-arch-john');
      expect(prompt.getStatus()).toBe(PromptStatus.APPROVED);
      expect(prompt.getApprovedBy()).toBe('lead-arch-john');

      // 3. Publish
      prompt.publish();
      expect(prompt.getStatus()).toBe(PromptStatus.PUBLISHED);
    });

    it('should enforce immutability on PUBLISHED prompts', () => {
      const prompt = PromptAggregate.create({
        name: 'Menu Recommendation Prompt',
        templateText: 'Recommend dishes for {{dietaryPreference}}.',
        author: 'ai-team',
        description: 'Menu recommendation',
      });

      prompt.approve('admin');
      prompt.publish();

      // Attempting to modify template text on a published prompt throws PublishedPromptImmutableException
      expect(() => prompt.updateTemplate('Tampered template')).toThrow(PublishedPromptImmutableException);
    });

    it('should support publishing a new version (SemVer upgrade)', () => {
      const prompt = PromptAggregate.create({
        name: 'Menu Recommendation Prompt',
        version: '1.0.0',
        templateText: 'Recommend dishes for {{dietaryPreference}}.',
        author: 'ai-team',
        description: 'Menu recommendation',
      });
      prompt.approve('admin');
      prompt.publish();

      const newVersion = prompt.publishNewVersion('1.1.0', 'Recommend dishes for {{dietaryPreference}} and {{allergy}}.');
      expect(newVersion.getVersion().getValue()).toBe('1.1.0');
      expect(newVersion.getStatus()).toBe(PromptStatus.PUBLISHED);
      expect(newVersion.getVariables().map(v => v.name)).toEqual(['dietaryPreference', 'allergy']);
    });
  });

  describe('Prompt Platform Services & End-to-End Pipeline', () => {
    let repo: InMemoryPromptRepository;
    let publisherAdapter: NestEventPublisherAdapter;
    let variableService: VariableService;
    let templateService: TemplateService;
    let evaluationService: EvaluationService;
    let approvalService: ApprovalService;
    let promptPlatformService: EnterprisePromptPlatformService;

    beforeEach(() => {
      repo = new InMemoryPromptRepository();
      publisherAdapter = new NestEventPublisherAdapter();
      variableService = new VariableService();
      templateService = new TemplateService();
      evaluationService = new EvaluationService();
      approvalService = new ApprovalService();

      promptPlatformService = new EnterprisePromptPlatformService(
        repo,
        publisherAdapter,
        variableService,
        templateService,
        evaluationService,
        approvalService
      );
    });

    it('should manage full end-to-end prompt registration, approval, evaluation, and query endpoints', async () => {
      // 1. Create Prompt
      const created = await promptPlatformService.createPrompt('tenant-main', {
        name: 'Table Reservation System Prompt',
        type: PromptType.SYSTEM_PROMPT,
        version: '1.0.0',
        templateText: 'Book table for {{partySize}} guests at {{reservationTime}}.',
        author: 'bot-team',
        description: 'Table booking prompt',
      });

      expect(created.status).toBe(PromptStatus.DRAFT);
      expect(created.variables).toEqual(['partySize', 'reservationTime']);

      // 2. Submit for Review & Approve
      await promptPlatformService.submitForReview(created.id, 'bot-author');
      await promptPlatformService.approvePrompt(created.id, 'lead-reviewer');
      const published = await promptPlatformService.publishPrompt(created.id);

      expect(published.status).toBe(PromptStatus.PUBLISHED);

      // 3. Evaluate Prompt
      const evalResult = await promptPlatformService.evaluatePrompt(created.id, {
        testVariables: { partySize: 4, reservationTime: '19:00' },
        expectedOutputContains: 'Book table for 4 guests at 19:00.',
      });

      expect(evalResult.status).toBe(EvaluationStatus.PASSED);
      expect(evalResult.overallScore).toBeGreaterThanOrEqual(70);

      // 4. Query Catalogs
      const catalog = await promptPlatformService.getPromptCatalog();
      expect(catalog.totalCount).toBe(1);

      const publishedList = await promptPlatformService.getPublishedPrompts();
      expect(publishedList.totalPublished).toBe(1);

      const stats = await promptPlatformService.getPromptStatistics();
      expect(stats.totalPrompts).toBe(1);
    });
  });
});
