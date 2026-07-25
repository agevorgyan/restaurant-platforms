export enum WorkflowStatus {
  Draft = 'Draft',
  Published = 'Published',
  Running = 'Running',
  Paused = 'Paused',
  Waiting = 'Waiting',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Failed = 'Failed',
  Compensating = 'Compensating',
}

export enum StepType {
  Task = 'Task',
  Decision = 'Decision',
  Timer = 'Timer',
  Parallel = 'Parallel',
  Event = 'Event',
  Approval = 'Approval',
  Integration = 'Integration',
  AI = 'AI',
  SubWorkflow = 'SubWorkflow',
}
