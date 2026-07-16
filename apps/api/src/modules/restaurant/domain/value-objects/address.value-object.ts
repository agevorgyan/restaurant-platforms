export class Address {
  constructor(
    public readonly street: string,
    public readonly city: string,
    public readonly state: string,
    public readonly zipCode: string,
    public readonly country: string,
    public readonly latitude?: number,
    public readonly longitude?: number,
  ) {}

  toString(): string {
    return `${this.street}, ${this.city}, ${this.state} ${this.zipCode}, ${this.country}`;
  }
}
