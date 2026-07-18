export class CustomerCode {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Customer code cannot be empty');
    }
  }
}
