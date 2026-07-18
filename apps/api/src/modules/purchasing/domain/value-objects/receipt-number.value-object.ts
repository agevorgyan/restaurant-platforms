export class ReceiptNumber {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Receipt number cannot be empty');
    }
  }
}
