export class PickupSettings {
  constructor(
    public readonly estimatedPickupTime: number,
  ) {
    if (estimatedPickupTime < 0) {
      throw new Error(`estimatedPickupTime must be a positive numeric value`);
    }
  }
}
