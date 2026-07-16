export class BranchCreatedEvent {
  constructor(
    public readonly branchId: string,
    public readonly restaurantId: string,
    public readonly name: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
