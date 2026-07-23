import { Menu } from '../aggregates/menu.aggregate';
import { MenuStatus } from '../enums/menu.enums';

export class MenuLifecyclePolicy {
  public static canPublish(menu: Menu): boolean {
    if (menu.status !== MenuStatus.DRAFT) return false;
    if (menu.categories.length === 0) return false;
    return true;
  }

  public static canActivate(menu: Menu): boolean {
    return menu.status === MenuStatus.PUBLISHED;
  }
}

export class MenuValidationPolicy {
  public static ensureImmutableCodeAfterPublish(/* oldStatus: MenuStatus, newStatus: MenuStatus */): void {
    // handled inside aggregate logic
  }
}

export class VisibilityPolicy {
  public static canBeVisible(status: MenuStatus): boolean {
    return status === MenuStatus.PUBLISHED || status === MenuStatus.ACTIVE;
  }
}

export class LayoutPolicy {
  public static validate(): void {
    // stub
  }
}