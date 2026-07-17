export class PortionSize {
  constructor(public readonly value: number, public readonly unit: string) {
    if (typeof value !== 'number' || value <= 0) {
      throw new Error('Portion size must be greater than zero');
    }
    if (!unit || unit.trim() === '') {
      throw new Error('Portion unit must be specified');
    }
  }
}
