import { Entity } from '@saas/core';

export interface SerialNumberAssignmentProps {
  lineId: string;
  serialNumber: string;
}

export class SerialNumberAssignment extends Entity<SerialNumberAssignmentProps> {
  get lineId(): string { return this.props.lineId; }
  get serialNumber(): string { return this.props.serialNumber; }

  private constructor(id: string, props: SerialNumberAssignmentProps) { super(id, props); }

  public static create(props: SerialNumberAssignmentProps, id?: string): SerialNumberAssignment {
    if (!props.serialNumber || props.serialNumber.trim() === '') throw new Error('SerialNumber cannot be empty');
    return new SerialNumberAssignment(id || crypto.randomUUID(), props);
  }
}