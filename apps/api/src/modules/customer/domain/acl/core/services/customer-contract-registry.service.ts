export class CustomerContractRegistry {
  private supportedTypes = ['Order', 'Marketing', 'Payment', 'Inventory', 'Kitchen', 'Procurement'];
  
  public isSupported(type: string): boolean {
    return this.supportedTypes.includes(type);
  }
}