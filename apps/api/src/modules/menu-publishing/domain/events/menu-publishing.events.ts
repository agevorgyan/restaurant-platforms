import { MenuPublishingPolicy } from '../value-objects/menu-publishing-policy.value-object';

export class MenuPublishedEvent {
  constructor(
    public readonly menuId: string,
    public readonly policy: MenuPublishingPolicy
  ) {}
}

export class MenuUnpublishedEvent {
  constructor(
    public readonly menuId: string,
    public readonly policy: MenuPublishingPolicy
  ) {}
}

export class MenuArchivedEvent {
  constructor(
    public readonly menuId: string,
    public readonly policy: MenuPublishingPolicy
  ) {}
}
