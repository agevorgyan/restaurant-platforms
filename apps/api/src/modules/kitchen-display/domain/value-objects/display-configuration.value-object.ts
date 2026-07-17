export class DisplayConfiguration {
  constructor(
    public readonly showCompletedTickets: boolean,
    public readonly showTimers: boolean,
    public readonly audioAlertsEnabled: boolean
  ) {
    if (typeof showCompletedTickets !== 'boolean' || 
        typeof showTimers !== 'boolean' || 
        typeof audioAlertsEnabled !== 'boolean') {
      throw new Error('Configuration flags must be booleans');
    }
  }
}
