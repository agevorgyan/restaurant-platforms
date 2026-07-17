export class MovementReason {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Movement reason must not be empty');
    }
  }
}
