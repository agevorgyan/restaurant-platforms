export enum RuleStatus {
  Draft = 'Draft',
  Published = 'Published',
  Deprecated = 'Deprecated',
  Archived = 'Archived',
}

export enum RuleExecutionResult {
  Matched = 'Matched',
  NotMatched = 'NotMatched',
  Skipped = 'Skipped',
  Failed = 'Failed',
}
