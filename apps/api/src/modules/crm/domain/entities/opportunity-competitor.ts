import { Entity, Identifier } from '@saas/domain';

export class OpportunityCompetitorId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): OpportunityCompetitorId { return new OpportunityCompetitorId(value); }
  public static generate(): OpportunityCompetitorId { return new OpportunityCompetitorId(crypto.randomUUID()); }
}

export class OpportunityCompetitor extends Entity<OpportunityCompetitorId> {
  constructor(
    id: OpportunityCompetitorId,
    public readonly competitorName: string,
    public readonly strengthLevel: string,
    public readonly notes: string
  ) {
    super(id);
  }

  public static create(competitorName: string, strengthLevel: string, notes: string = ''): OpportunityCompetitor {
    if (!competitorName || competitorName.trim().length === 0) throw new Error('Competitor name cannot be empty.');
    return new OpportunityCompetitor(OpportunityCompetitorId.generate(), competitorName, strengthLevel, notes);
  }
}
