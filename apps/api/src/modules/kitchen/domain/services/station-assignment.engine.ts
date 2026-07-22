import { KitchenTicket } from '../aggregates/kitchen-ticket.aggregate';
import { AssignmentPlan, AssignmentMapping } from '../value-objects/assignment-plan.value-object';
import { StationAvailabilitySpecification } from '../specifications/workflow.specification';
import { AssignmentPolicy } from '../policies/workflow.policy';

export interface StationCapacity {
  stationId: string;
  maxCapacity: number;
  currentQueueDepth: number;
}

export class StationAssignmentEngine {
  public assignTicketToStations(
    ticket: KitchenTicket,
    availableStations: StationCapacity[]
  ): AssignmentPlan {
    const mappings: AssignmentMapping[] = [];

    // Basic balancing assignment logic:
    // For each item in the ticket, find the station with the lowest queue depth that is available.
    for (const item of ticket.items) {
      const stationId = item.stationReference?.stationId;
      if (stationId) {
        // If the item specifies a preferred station, verify its availability if capacity is known
        const station = availableStations.find(s => s.stationId === stationId);
        if (station && StationAvailabilitySpecification.isStationAvailable(station.stationId, station.currentQueueDepth, station.maxCapacity)) {
          AssignmentPolicy.ensureValidAssignment(station.stationId, item.id);
          mappings.push({ itemId: item.id, stationId: station.stationId });
          station.currentQueueDepth++;
        } else {
          // If no specific station or preferred station is full, fallback to load balancing across all available stations
          const bestStation = this.findLeastBusyStation(availableStations);
          if (bestStation) {
             AssignmentPolicy.ensureValidAssignment(bestStation.stationId, item.id);
             mappings.push({ itemId: item.id, stationId: bestStation.stationId });
             bestStation.currentQueueDepth++;
          }
        }
      } else {
         const bestStation = this.findLeastBusyStation(availableStations);
          if (bestStation) {
             AssignmentPolicy.ensureValidAssignment(bestStation.stationId, item.id);
             mappings.push({ itemId: item.id, stationId: bestStation.stationId });
             bestStation.currentQueueDepth++;
          }
      }
    }

    if (mappings.length === 0 && ticket.items.length > 0) {
      throw new Error('Could not assign any items to stations due to capacity constraints');
    }

    return AssignmentPlan.create(mappings);
  }

  private findLeastBusyStation(stations: StationCapacity[]): StationCapacity | undefined {
    let leastBusy: StationCapacity | undefined = undefined;
    
    for (const station of stations) {
      if (StationAvailabilitySpecification.isStationAvailable(station.stationId, station.currentQueueDepth, station.maxCapacity)) {
        if (!leastBusy || station.currentQueueDepth < leastBusy.currentQueueDepth) {
          leastBusy = station;
        }
      }
    }

    return leastBusy;
  }
}
