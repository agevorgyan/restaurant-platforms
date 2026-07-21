import { Coupon } from '../aggregates/coupon.aggregate';

export interface CouponRepository {
  findById(id: string): Promise<Coupon | null>;
  findByCode(code: string): Promise<Coupon | null>;
  save(coupon: Coupon): Promise<void>;
  delete(id: string): Promise<void>;
  isCodeUnique(code: string): Promise<boolean>;
}
