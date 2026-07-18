export class PrivacyPreference {
  constructor(
    public readonly marketingOptIn: boolean,
    public readonly dataSharingOptIn: boolean,
    public readonly trackingOptIn: boolean
  ) {}
}
