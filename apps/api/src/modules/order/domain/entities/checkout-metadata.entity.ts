import { Entity } from '@saas/core';

export interface CheckoutMetadataProps {
  data: Record<string, any>;
}

export class CheckoutMetadata extends Entity<CheckoutMetadataProps> {
  private constructor(id: string, props: CheckoutMetadataProps) {
    super(id, props);
  }

  public static create(data: Record<string, any> = {}, id?: string): CheckoutMetadata {
    try {
      JSON.stringify(data);
    } catch {
      throw new Error('CheckoutMetadata data must be JSON serializable');
    }

    return new CheckoutMetadata(id || crypto.randomUUID(), { data });
  }

  public update(key: string, value: any): void {
    try {
      JSON.stringify(value);
    } catch {
      throw new Error('CheckoutMetadata value must be JSON serializable');
    }
    
    this.props.data[key] = value;
  }

  public get(key: string): any {
    return this.props.data[key];
  }

  get data(): Record<string, any> {
    return { ...this.props.data };
  }
}
