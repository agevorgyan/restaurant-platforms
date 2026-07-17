import { CartTotals } from '../value-objects/cart-totals.value-object';
import { CartStatus } from '../value-objects/cart-status.value-object';
import { CartExpiration } from '../value-objects/cart-expiration.value-object';
import { ICartItem } from './cart-item.interface';

export interface ICart {
  id: string;
  restaurantId: string;
  branchId: string;
  customerId?: string;
  sessionId?: string;
  tableId?: string;
  currency: string;
  status: CartStatus;
  items: ICartItem[];
  totals: CartTotals;
  expiresAt: CartExpiration;
  createdAt: Date;
  updatedAt: Date;
}
