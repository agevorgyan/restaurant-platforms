import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { SegmentStatus } from './value-objects/segment-status.value-object';
import { SegmentType } from './value-objects/segment-type.value-object';
import { SegmentPriority } from './value-objects/segment-priority.value-object';
import { SegmentEvaluationPolicy } from './value-objects/segment-evaluation-policy.value-object';
import { SegmentRuleOperator } from './value-objects/segment-rule-operator.value-object';
import { validateCreateCustomerSegment } from '../application/validation/customer-segment.schema';
import { CustomerSegmentDomainService } from './services/customer-segment.domain.service';
import { ICustomerSegmentRepository } from './repositories/customer-segment.repository.interface';
import { ICustomerSegment } from './entities/customer-segment.interface';

describe('Customer Segment Domain', () => {
  describe('Value Objects', () => {
    it('SegmentStatus should validate', () => {
      assert.doesNotThrow(() => new SegmentStatus('Draft'));
      assert.throws(() => new SegmentStatus('Invalid' as any));
    });

    it('SegmentType should validate', () => {
      assert.doesNotThrow(() => new SegmentType('Dynamic'));
      assert.throws(() => new SegmentType('Invalid' as any));
    });

    it('SegmentPriority should validate', () => {
      assert.doesNotThrow(() => new SegmentPriority(1));
      assert.throws(() => new SegmentPriority(-1));
      assert.throws(() => new SegmentPriority(1.5));
    });

    it('SegmentEvaluationPolicy should validate', () => {
      assert.doesNotThrow(() => new SegmentEvaluationPolicy('Realtime'));
      assert.throws(() => new SegmentEvaluationPolicy('Invalid' as any));
    });

    it('SegmentRuleOperator should validate', () => {
      assert.doesNotThrow(() => new SegmentRuleOperator('GreaterThanOrEqual'));
      assert.doesNotThrow(() => new SegmentRuleOperator('In'));
      assert.throws(() => new SegmentRuleOperator('Invalid' as any));
    });
  });

  describe('Validation', () => {
    it('should validate CreateCustomerSegmentDto', () => {
      const err = validateCreateCustomerSegment({
        restaurantId: 'r1',
        name: 'VIP',
        segmentType: 'Static',
        priority: 1,
        evaluationPolicy: 'Manual',
        rules: []
      } as any);
      assert.ok(err.includes('Segment must contain at least one rule'));
    });

    it('should validate uniqueness of rule order', () => {
      const err = validateCreateCustomerSegment({
        restaurantId: 'r1',
        name: 'VIP',
        segmentType: 'Static',
        priority: 1,
        evaluationPolicy: 'Manual',
        rules: [
          { field: 'f1', operator: 'Equals', value: 'v', logicalOperator: 'AND', order: 1 },
          { field: 'f2', operator: 'Equals', value: 'v', logicalOperator: 'AND', order: 1 }
        ]
      } as any);
      assert.ok(err.includes('Rule order must be unique within the segment'));
    });
  });

  describe('Domain Service', () => {
    const mockSegments: ICustomerSegment[] = [];
    const mockRepo: ICustomerSegmentRepository = {
      findById: async (id) => mockSegments.find(s => s.id === id) || null,
      findByName: async (rid, n) => mockSegments.find(s => s.restaurantId === rid && s.name === n) || null,
      save: async (s) => {
        const i = mockSegments.findIndex(ms => ms.id === s.id);
        if (i >= 0) mockSegments[i] = s;
        else mockSegments.push(s);
      }
    };

    const service = new CustomerSegmentDomainService(mockRepo);

    it('should create segment successfully', async () => {
      const seg = await service.createSegment('seg1', {
        restaurantId: 'r1',
        name: 'Test Segment',
        segmentType: 'Static',
        priority: 10,
        evaluationPolicy: 'Manual',
        rules: [{ field: 'f1', operator: 'Equals', value: 1, logicalOperator: 'AND', order: 1 }]
      });

      assert.strictEqual(seg.id, 'seg1');
      assert.strictEqual(seg.status.value, 'Draft');
      assert.strictEqual(seg.rules.length, 1);
      assert.ok(seg.domainEvents?.some(e => e.eventName === 'CustomerSegmentCreated'));
    });

    it('should enforce unique segment name', async () => {
      try {
        await service.createSegment('seg2', {
          restaurantId: 'r1',
          name: 'Test Segment', // duplicate
          segmentType: 'Static',
          priority: 10,
          evaluationPolicy: 'Manual',
          rules: [{ field: 'f1', operator: 'Equals', value: 1, logicalOperator: 'AND', order: 1 }]
        });
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Segment name must be unique within the restaurant');
      }
    });

    it('should manage rules', async () => {
      await service.addRule('seg1', { field: 'f2', operator: 'In', value: [1], logicalOperator: 'OR', order: 2 });
      let seg = await mockRepo.findById('seg1');
      assert.strictEqual(seg?.rules.length, 2);

      const ruleId = seg!.rules[1].id;
      await service.updateRule('seg1', ruleId, { field: 'f2', operator: 'NotIn', value: [2], logicalOperator: 'AND', order: 2 });
      seg = await mockRepo.findById('seg1');
      assert.strictEqual(seg?.rules[1].operator.value, 'NotIn');

      await service.removeRule('seg1', ruleId);
      seg = await mockRepo.findById('seg1');
      assert.strictEqual(seg?.rules.length, 1);
      
      try {
        await service.removeRule('seg1', seg!.rules[0].id);
        assert.fail('Should throw');
      } catch(e: any) {
        assert.strictEqual(e.message, 'Segment must contain at least one rule');
      }
    });

    it('should manage lifecycle and read-only constraints', async () => {
      let seg = await service.activateSegment('seg1');
      assert.strictEqual(seg.status.value, 'Active');

      seg = await service.archiveSegment('seg1');
      assert.strictEqual(seg.status.value, 'Archived');

      try {
        await service.deactivateSegment('seg1');
        assert.fail('Should throw');
      } catch(e: any) {
        assert.strictEqual(e.message, 'Archived segments are read-only');
      }
    });
  });
});
