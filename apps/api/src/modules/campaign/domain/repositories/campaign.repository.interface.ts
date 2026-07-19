import { Campaign } from '../aggregates/campaign.aggregate';
import { CampaignId } from '../value-objects/campaign-id.value-object';

export interface CampaignRepository {
  save(campaign: Campaign): Promise<void>;
  findById(id: CampaignId): Promise<Campaign | null>;
  findAll(): Promise<Campaign[]>;
}
