export interface IMembershipTier {
  id: string;
  name: string;
  minimumPoints: number;
  benefits: string[];
  priority: number;
}
