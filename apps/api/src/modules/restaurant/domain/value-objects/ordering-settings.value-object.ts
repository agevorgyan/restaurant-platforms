export class OrderingSettings {
  constructor(
    public readonly dineInEnabled: boolean,
    public readonly pickupEnabled: boolean,
    public readonly deliveryEnabled: boolean,
    public readonly qrOrderingEnabled: boolean,
  ) {}
}
