export class DisplayRefreshPolicy {
  constructor(public readonly intervalSeconds: number) {
    if (!Number.isInteger(intervalSeconds) || intervalSeconds <= 0) {
      throw new Error('Refresh interval must be an integer greater than zero');
    }
  }
}
