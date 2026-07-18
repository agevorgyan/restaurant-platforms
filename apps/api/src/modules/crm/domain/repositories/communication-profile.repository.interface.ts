import { ICommunicationProfile } from '../entities/communication-profile.interface';

export interface ICommunicationProfileRepository {
  findById(id: string): Promise<ICommunicationProfile | null>;
  findByCustomerId(restaurantId: string, customerId: string): Promise<ICommunicationProfile | null>;
  save(profile: ICommunicationProfile): Promise<void>;
}
