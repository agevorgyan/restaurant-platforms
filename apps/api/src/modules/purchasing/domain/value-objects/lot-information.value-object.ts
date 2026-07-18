export class LotInformation {
  constructor(public readonly lotNumber: string) {
    if (!lotNumber || lotNumber.trim() === '') {
      throw new Error('Lot number cannot be empty');
    }
  }
}
