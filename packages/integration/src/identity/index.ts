export class ExternalReference<T = unknown> {
  private constructor(
    public readonly id: string,
    public readonly context: string,
    public readonly metadata?: T
  ) {}

  public static create<T>(id: string, context: string, metadata?: T): ExternalReference<T> {
    return new ExternalReference<T>(id, context, metadata);
  }
}
