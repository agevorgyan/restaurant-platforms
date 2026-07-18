export class ExpirationInformation {
  constructor(public readonly expirationDate: Date) {
    if (!(expirationDate instanceof Date) || isNaN(expirationDate.getTime())) {
      throw new Error('Invalid expiration date');
    }
  }
}
