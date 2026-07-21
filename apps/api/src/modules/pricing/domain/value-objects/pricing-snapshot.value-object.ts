import { ValueObject } from '@saas/core';

export interface PricingSnapshotProps {
  data: any; // The frozen data representation
  timestamp: Date;
  version: number;
  hash: string;
}

export class PricingSnapshot extends ValueObject<PricingSnapshotProps> {
  private constructor(props: PricingSnapshotProps) {
    super(props);
  }

  public static create(data: any, version: number): PricingSnapshot {
    const timestamp = new Date();
    // Simplified hash generation for immutability check
    const hash = Buffer.from(JSON.stringify(data) + timestamp.getTime() + version).toString('base64');
    
    return new PricingSnapshot({
      data: Object.freeze(JSON.parse(JSON.stringify(data))), // Deep freeze
      timestamp,
      version,
      hash,
    });
  }

  get data(): any {
    return this.props.data;
  }

  get timestamp(): Date {
    return this.props.timestamp;
  }

  get version(): number {
    return this.props.version;
  }

  get hash(): string {
    return this.props.hash;
  }
}
