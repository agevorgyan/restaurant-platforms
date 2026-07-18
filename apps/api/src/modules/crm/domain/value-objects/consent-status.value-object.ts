export type ConsentStatusValue = 'Granted' | 'Revoked' | 'Pending';

export class ConsentStatus {
  constructor(public readonly value: ConsentStatusValue) {
    const validStatuses = ['Granted', 'Revoked', 'Pending'];
    if (!validStatuses.includes(value)) {
      throw new Error(`Invalid consent status: ${value}`);
    }
  }
}
