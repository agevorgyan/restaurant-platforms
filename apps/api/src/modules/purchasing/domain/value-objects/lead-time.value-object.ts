export class LeadTime {
  constructor(public readonly days: number) {
    if (typeof days !== 'number' || days < 0 || !Number.isInteger(days)) {
      throw new Error('Lead time must be a non-negative integer representing days');
    }
  }
}
