export class BranchActivatedEvent {
  constructor(
    public readonly branchId: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
