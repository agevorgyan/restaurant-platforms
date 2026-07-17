export class RecountPolicy {
  public static canRecount(statusValue: string): boolean {
    return statusValue !== 'Approved' && statusValue !== 'Cancelled';
  }
}
