export class CustomerSnapshot {
  constructor(
    public readonly customerId: string,
    public readonly name: string,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly taxId?: string
  ) {
    if (!customerId) throw new Error('Customer ID is required');
    if (!name) throw new Error('Customer name is required');
  }
}
