import { Entity } from '@saas/core';

export interface DamageReportProps {
  lineId: string;
  description: string;
  reportedAt: Date;
  severity: string;
}

export class DamageReport extends Entity<DamageReportProps> {
  get lineId(): string { return this.props.lineId; }
  get description(): string { return this.props.description; }
  get reportedAt(): Date { return this.props.reportedAt; }
  get severity(): string { return this.props.severity; }

  private constructor(id: string, props: DamageReportProps) { super(id, props); }

  public static create(props: DamageReportProps, id?: string): DamageReport {
    return new DamageReport(id || crypto.randomUUID(), props);
  }
}