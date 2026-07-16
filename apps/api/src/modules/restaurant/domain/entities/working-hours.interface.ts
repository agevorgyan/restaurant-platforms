import { TimeRange } from '../value-objects';

export interface IWorkingHours {
  id: string;
  branchId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  ranges: TimeRange[];
  isClosed: boolean;
}
