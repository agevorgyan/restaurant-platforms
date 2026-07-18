export class ReturnNumber {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Return number cannot be empty');
    }
  }
}
