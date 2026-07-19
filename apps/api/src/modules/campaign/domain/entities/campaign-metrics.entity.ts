import { Entity } from '@saas/core';

export interface CampaignMetricsProps {
  impressions: number;
  clicks: number;
  conversions: number;
  revenueGenerated: number;
}

export class CampaignMetrics extends Entity<CampaignMetricsProps> {
  private constructor(id: string, props: CampaignMetricsProps) {
    super(id, props);
  }

  public static create(id: string): CampaignMetrics {
    return new CampaignMetrics(id, {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenueGenerated: 0,
    });
  }

  get impressions(): number {
    return this.props.impressions;
  }

  get clicks(): number {
    return this.props.clicks;
  }

  get conversions(): number {
    return this.props.conversions;
  }

  get revenueGenerated(): number {
    return this.props.revenueGenerated;
  }

  public recordImpression(): void {
    this.props.impressions += 1;
  }

  public recordClick(): void {
    this.props.clicks += 1;
  }

  public recordConversion(revenue: number): void {
    this.props.conversions += 1;
    this.props.revenueGenerated += revenue;
  }
}
