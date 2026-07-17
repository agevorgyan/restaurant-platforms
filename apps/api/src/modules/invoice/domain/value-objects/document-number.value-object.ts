export class DocumentNumber {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Document number cannot be empty');
    }
  }
}
