import { KitchenTicket } from '../aggregates/kitchen-ticket.aggregate';
import { EstimatedCompletionTime } from '../value-objects/estimated-completion-time.value-object';
import { KitchenQueueManager } from './kitchen-queue.manager';
import { QueueSnapshot } from '../value-objects/queue-snapshot.value-object';

export class KitchenTimeEstimator {
  constructor(private readonly queueManager: KitchenQueueManager) {}

  public estimateTicketCompletion(
    ticket: KitchenTicket,
    relevantQueueSnapshots: QueueSnapshot[]
  ): EstimatedCompletionTime {
    let totalPrepTime = 0;

    // Base prep time from the ticket itself if defined, else sum of items
    if (ticket.props.estimatedPreparationTime) {
      totalPrepTime = ticket.props.estimatedPreparationTime.minutes;
    } else {
      for (const item of ticket.items) {
        if (item.props.estimatedDuration) {
          totalPrepTime += item.props.estimatedDuration.minutes;
        } else {
          totalPrepTime += 5; // Default assumption 5 min per item
        }
      }
    }

    // Add max queue delay among the relevant stations
    let maxQueueDelay = 0;
    for (const snapshot of relevantQueueSnapshots) {
      const delay = this.queueManager.estimateQueueDelayMinutes(snapshot);
      if (delay > maxQueueDelay) {
        maxQueueDelay = delay;
      }
    }

    const totalMinutes = totalPrepTime + maxQueueDelay;
    return EstimatedCompletionTime.fromNow(totalMinutes);
  }
}
