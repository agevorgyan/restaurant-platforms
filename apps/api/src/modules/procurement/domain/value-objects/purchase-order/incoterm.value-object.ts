import { ValueObject } from '@saas/core';

export interface IncotermProps { code: string; location?: string; }

export class Incoterm extends ValueObject<IncotermProps> {
  get code(): string { return this.props.code; }
  get location(): string | undefined { return this.props.location; }
  private constructor(props: IncotermProps) { super(props); }
  public static create(code: string, location?: string): Incoterm {
    if (!code || code.trim() === '') throw new Error('Incoterm code cannot be empty');
    return new Incoterm({ code: code.toUpperCase().trim(), location });
  }
}