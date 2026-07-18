export class SupplierAddress {
  constructor(
    public readonly street: string,
    public readonly city: string,
    public readonly state: string,
    public readonly postalCode: string,
    public readonly country: string
  ) {
    if (!country || country.trim() === '') {
      throw new Error('Country is required for an address');
    }
  }
}
