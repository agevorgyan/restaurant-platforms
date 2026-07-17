import { ICart } from '../entities/cart.interface';

export interface ICartRepository {
  findById(id: string): Promise<ICart | null>;
  create(cart: ICart): Promise<ICart>;
  update(id: string, updates: Partial<ICart>): Promise<ICart>;
}
