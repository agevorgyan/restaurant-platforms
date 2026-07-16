import { IMenu } from '../entities/menu.interface';

export class MenuCreatedEvent {
  constructor(public readonly menu: IMenu) {}
}

export class MenuUpdatedEvent {
  constructor(public readonly menu: IMenu) {}
}

export class MenuPublishedEvent {
  constructor(public readonly menuId: string, public readonly restaurantId: string) {}
}

export class MenuArchivedEvent {
  constructor(public readonly menuId: string, public readonly restaurantId: string) {}
}
