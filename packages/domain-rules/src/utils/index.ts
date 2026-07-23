export const isRuleEvaluationResult = (obj: unknown): obj is import('../results').RuleEvaluationResult => {
  return typeof obj === 'object' && obj !== null && 'passed' in obj;
};
