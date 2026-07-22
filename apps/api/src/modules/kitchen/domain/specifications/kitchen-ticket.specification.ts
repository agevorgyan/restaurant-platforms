import { KitchenTicketItem } from '../entities/kitchen-ticket-item.entity';
import { KitchenTicketStatus as KitchenTicketStatusEnum } from '../enums/kitchen-ticket-status.enum';

export class KitchenTicketItemSpecification {
  public static isSatisfiedBy(
    items: KitchenTicketItem[],
    newItem: KitchenTicketItem
  ): boolean {
    const exists = items.some(
      (item) => item.orderItemReference.orderItemId === newItem.orderItemReference.orderItemId
    );
    return !exists;
  }
}

export class KitchenTicketConsistencySpecification {
  public static isSatisfiedBy(items: KitchenTicketItem[]): boolean {
    if (items.length === 0) {
      return false;
    }

    const itemIds = items.map((i) => i.orderItemReference.orderItemId);
    const uniqueIds = new Set(itemIds);
    return uniqueIds.size === itemIds.length;
  }
}

export class KitchenTicketLifecycleSpecification {
  public static canTransition(
    currentStatus: KitchenTicketStatusEnum,
    newStatus: KitchenTicketStatusEnum
  ): boolean {
    if (currentStatus === KitchenTicketStatusEnum.CANCELLED || currentStatus === KitchenTicketStatusEnum.SERVED) {
      return false;
    }

    switch (currentStatus) {
      case KitchenTicketStatusEnum.PENDING:
        return [KitchenTicketStatusEnum.QUEUED, KitchenTicketStatusEnum.CANCELLED].includes(newStatus);
      case KitchenTicketStatusEnum.QUEUED:
        return [KitchenTicketStatusEnum.IN_PREPARATION, KitchenTicketStatusEnum.CANCELLED].includes(newStatus);
      case KitchenTicketStatusEnum.IN_PREPARATION:
        return [KitchenTicketStatusEnum.READY, KitchenTicketStatusEnum.CANCELLED].includes(newStatus);
      case KitchenTicketStatusEnum.READY:
        return [KitchenTicketStatusEnum.SERVED].includes(newStatus);
      default:
        return false;
    }
  }
}

export class KitchenStationAssignmentSpecification {
  public static isSatisfiedBy(item: KitchenTicketItem): boolean {
    return !!item.stationReference;
  }
}
