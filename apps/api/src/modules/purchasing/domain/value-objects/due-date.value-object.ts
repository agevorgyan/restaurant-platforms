export class DueDate {
  constructor(public readonly value: Date) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('Invalid due date');
    }
  }

  isOverdue(currentDate: Date = new Date()): boolean {
    return this.value.getTime() < currentDate.getTime();
  }
}
