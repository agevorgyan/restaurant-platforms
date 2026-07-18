import { ICustomerSegment } from '../entities/customer-segment.interface';

export interface ICustomerSegmentRepository {
  findById(id: string): Promise<ICustomerSegment | null>;
  findByName(restaurantId: string, name: string): Promise<ICustomerSegment | null>;
  save(segment: ICustomerSegment): Promise<void>;
}
