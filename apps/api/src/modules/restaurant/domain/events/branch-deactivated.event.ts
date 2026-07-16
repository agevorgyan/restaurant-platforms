export class BranchDeactivatedEvent {
  constructor(
    public readonly branchId: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
