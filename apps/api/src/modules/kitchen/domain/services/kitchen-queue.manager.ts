import { QueueSnapshot, QueueItemSnapshot } from '../value-objects/queue-snapshot.value-object';
import { QueuePolicy } from '../policies/workflow.policy';
import { QueueConsistencySpecification } from '../specifications/workflow.specification';

export class KitchenQueueManager {
  public balanceStationQueue(snapshot: QueueSnapshot): QueueItemSnapshot[] {
    if (!QueueConsistencySpecification.isValidSnapshot(snapshot.getDepth())) {
      throw new Error('Invalid queue snapshot state');
    }

    const items = snapshot.items;
    
    // Sort logic: 
    // 1. By computed priority (lowest number is highest priority)
    // 2. By entry time (FIFO)
    return items.sort((a, b) => {
      const isRushA = a.priorityValue === 1; // Assuming 1 is Rush from ProductionPriority
      const isRushB = b.priorityValue === 1;

      const priorityA = QueuePolicy.determineQueuePriority(a.priorityValue, isRushA);
      const priorityB = QueuePolicy.determineQueuePriority(b.priorityValue, isRushB);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      return a.enteredAt.getTime() - b.enteredAt.getTime();
    });
  }

  public estimateQueueDelayMinutes(snapshot: QueueSnapshot): number {
    // A simplified heuristic: each item adds 3 minutes of delay
    const depth = snapshot.getDepth();
    return depth * 3; 
  }
}
