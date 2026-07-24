import { Controller, Get, Param, Query } from '@nestjs/common';
import { 
  InsightSnapshot, 
  Recommendation, 
  BusinessRisk, 
  Anomaly 
} from '../../application/read-models';
import { InsightGenerationService } from '../../application/services';

@Controller('enterprise/insights')
export class AIInsightsController {
  constructor(
    private readonly insightGenerationService: InsightGenerationService
  ) {}

  @Get()
  async getEnterpriseInsights(@Query('targetId') targetId: string): Promise<InsightSnapshot[]> {
    const result = await this.insightGenerationService.generateInsights(targetId || 'default-org', { historicalSeries: [25, 26, 25, 27, 24, 35] });
    return result.insights;
  }

  @Get(':id')
  async getInsightById(@Param('id') id: string): Promise<InsightSnapshot | null> {
    const result = await this.insightGenerationService.generateInsights('default-org', { historicalSeries: [25, 26, 25, 27, 24, 35] });
    return result.insights.find(i => i.insightId === id) || null;
  }

  @Get('recommendations')
  async getRecommendations(@Query('targetId') targetId: string): Promise<Recommendation[]> {
    const result = await this.insightGenerationService.generateInsights(targetId || 'default-org', { historicalSeries: [25, 26, 25, 27, 24, 35] });
    return result.recommendations;
  }

  @Get('anomalies')
  async getAnomalies(@Query('targetId') targetId: string): Promise<Anomaly[]> {
    const result = await this.insightGenerationService.generateInsights(targetId || 'default-org', { historicalSeries: [25, 26, 25, 27, 24, 35] });
    return result.anomalies;
  }

  @Get('business-risks')
  async getBusinessRisks(@Query('targetId') targetId: string): Promise<BusinessRisk[]> {
    const result = await this.insightGenerationService.generateInsights(targetId || 'default-org', null);
    return result.risks;
  }
}
