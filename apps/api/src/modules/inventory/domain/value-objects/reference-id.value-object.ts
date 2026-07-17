export class ReferenceId {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Reference ID must not be empty');
    }
  }
}
