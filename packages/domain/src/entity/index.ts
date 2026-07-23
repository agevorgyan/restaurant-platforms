import { Identifier } from '../identifier';

export abstract class Entity<TId extends Identifier<unknown>> {
  protected readonly _id: TId;

  constructor(id: TId) {
    this._id = id;
  }

  get id(): TId {
    return this._id;
  }

  public equals(object?: Entity<TId>): boolean {
    if (object === null || object === undefined) {
      return false;
    }
    if (this === object) {
      return true;
    }
    if (!(object instanceof Entity)) {
      return false;
    }
    return this._id.equals(object.id);
  }
}
