export class PreparationTime {
  constructor(public readonly minutes: number) {
    if (minutes <= 0) {
      throw new Error('Preparation time must be greater than zero');
    }
    if (!Number.isInteger(minutes)) {
      throw new Error('Preparation time must be an integer');
    }
  }
}
