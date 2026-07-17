import { IPromotion } from '../entities/promotion.interface';

export interface IPromotionRepository {
  findById(id: string): Promise<IPromotion | null>;
  findByCode(restaurantId: string, code: string): Promise<IPromotion | null>;
  create(promotion: IPromotion): Promise<IPromotion>;
  update(id: string, updates: Partial<IPromotion>): Promise<IPromotion>;
}
