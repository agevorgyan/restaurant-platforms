export type SegmentEvaluationPolicyValue = 'Realtime' | 'Batch' | 'Manual';

export class SegmentEvaluationPolicy {
  constructor(public readonly value: SegmentEvaluationPolicyValue) {
    const validPolicies = ['Realtime', 'Batch', 'Manual'];
    if (!validPolicies.includes(value)) {
      throw new Error(`Invalid segment evaluation policy: ${value}`);
    }
  }
}
