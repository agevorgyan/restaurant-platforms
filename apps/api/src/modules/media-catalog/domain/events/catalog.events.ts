export class MediaIndexed {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly indexVersion: number
  ) {}
}

export class MediaReindexed {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string,
    public readonly indexVersion: number
  ) {}
}

export class MediaRemovedFromCatalog {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly mediaId: string,
    public readonly tenantId: string
  ) {}
}

export class AlbumCreated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly albumId: string,
    public readonly tenantId: string,
    public readonly name: string
  ) {}
}

export class AlbumUpdated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly albumId: string,
    public readonly tenantId: string,
    public readonly updates: Record<string, any>
  ) {}
}

export class CollectionCreated {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly collectionId: string,
    public readonly tenantId: string,
    public readonly name: string
  ) {}
}

export class CatalogSynchronized {
  public readonly occurredOn: Date = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly newIndexVersion: number
  ) {}
}
