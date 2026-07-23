import { Identifier } from './identifier';

export abstract class Entity<TId extends Identifier<unknown>> {
  protected readonly _id: TId;
  public readonly createdAt: Date;
  public updatedAt: Date;

  protected constructor(id: TId, createdAt?: Date, updatedAt?: Date) {
    this._id = id;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  get id(): TId {
    return this._id;
  }

  public equals(other: Entity<TId>): boolean {
    if (other === null || other === undefined) return false;
    if (this === other) return true;
    return this._id.equals(other.id);
  }
}
