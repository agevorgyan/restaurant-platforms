export class QueueOrderingSpecification {
  public static sortEntries(entries: any[]): any[] {
    return [...entries].sort((a, b) => {
      if (a.priority.priorityLevel !== b.priority.priorityLevel) {
        return b.priority.priorityLevel - a.priority.priorityLevel; // higher priority first
      }
      return a.createdAt.getTime() - b.createdAt.getTime(); // FIFO
    });
  }
}

export class PromotionEligibilitySpecification {
  public static isEligible(status: string): boolean {
    return status === 'WAITING' || status === 'ELIGIBLE';
  }
}

export class AcceptanceWindowSpecification {
  public static isValid(deadline: Date, now = new Date()): boolean {
    return deadline.getTime() > now.getTime();
  }
}

export class WaitlistConsistencySpecification {
  public static isConsistent(partySize: number): boolean {
    return partySize > 0;
  }
}

export class ExpirationSpecification {
  public static isExpired(deadline: Date, now = new Date()): boolean {
    return now.getTime() >= deadline.getTime();
  }
}