export interface IRestaurant {
  id: string;
  name: string;
  slug: string;
  organizationId: string; // Links back to Identity domain
  logoUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
