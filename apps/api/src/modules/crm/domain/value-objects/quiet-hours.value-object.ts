export class QuietHours {
  constructor(
    public readonly startTime: string,
    public readonly endTime: string
  ) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      throw new Error('Quiet hours must be in HH:mm format');
    }
  }
}
