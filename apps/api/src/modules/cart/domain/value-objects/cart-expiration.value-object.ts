export class CartExpiration {
  constructor(public readonly expiresAt: Date) {
    if (!expiresAt) {
      throw new Error('Expiration date is required');
    }
  }

  public isExpired(currentDate: Date = new Date()): boolean {
    return this.expiresAt.getTime() < currentDate.getTime();
  }
}
