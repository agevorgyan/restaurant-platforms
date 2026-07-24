import { IRepository } from '@saas/domain';
import { Lead } from '../aggregates/lead';
import { Opportunity } from '../aggregates/opportunity';

export interface ILeadRepository extends IRepository<Lead> {
  findByEmail(email: string): Promise<Lead | null>;
  findUnassigned(): Promise<Lead[]>;
  findByStatus(status: string): Promise<Lead[]>;
}

export interface IOpportunityRepository extends IRepository<Opportunity> {
  findByLeadId(leadId: string): Promise<Opportunity[]>;
  findOpenOpportunities(): Promise<Opportunity[]>;
  findByStage(stage: string): Promise<Opportunity[]>;
}

import { Interaction } from '../aggregates/interaction';

export interface IInteractionRepository extends IRepository<Interaction> {
  findByParticipant(entityType: string, entityId: string): Promise<Interaction[]>;
  findPendingFollowUps(assigneeId: string): Promise<Interaction[]>;
}

import { CustomerJourney } from '../aggregates/customer-journey';

export interface ICustomerJourneyRepository extends IRepository<CustomerJourney> {
  findByCustomer(customerReference: string): Promise<CustomerJourney[]>;
  findActiveJourney(customerReference: string, journeyType: string): Promise<CustomerJourney | null>;
  findJourneysByStage(stage: string): Promise<CustomerJourney[]>;
}

import { CampaignEngagement } from '../aggregates/campaign-engagement';

export interface ICampaignEngagementRepository extends IRepository<CampaignEngagement> {
  findByCampaign(campaignReference: string): Promise<CampaignEngagement[]>;
  findByTarget(targetReference: string): Promise<CampaignEngagement[]>;
  findByCampaignAndTarget(campaignReference: string, targetReference: string): Promise<CampaignEngagement | null>;
}
