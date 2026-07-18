export class LoyaltyExpirationPolicy {
  constructor(public readonly type: 'Never' | 'FixedDate' | 'RollingDays', public readonly value?: number | Date) {
    if (type === 'FixedDate' && !(value instanceof Date)) {
      throw new Error('FixedDate policy requires a Date value');
    }
    if (type === 'RollingDays' && typeof value !== 'number') {
      throw new Error('RollingDays policy requires a numeric value in days');
    }
  }

  calculateExpirationDate(occurredAt: Date): Date | undefined {
    if (this.type === 'Never') return undefined;
    if (this.type === 'FixedDate') return this.value as Date;
    if (this.type === 'RollingDays') {
      const days = this.value as number;
      const d = new Date(occurredAt.getTime());
      d.setDate(d.getDate() + days);
      return d;
    }
    return undefined;
  }
}
