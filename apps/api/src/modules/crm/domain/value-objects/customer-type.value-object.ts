export type CustomerTypeValue = 'Individual' | 'Business' | 'VIP' | 'Employee' | 'Partner';

export class CustomerType {
  constructor(public readonly value: CustomerTypeValue) {
    const validTypes = ['Individual', 'Business', 'VIP', 'Employee', 'Partner'];
    if (!validTypes.includes(value)) {
      throw new Error(`Invalid customer type: ${value}`);
    }
  }
}
