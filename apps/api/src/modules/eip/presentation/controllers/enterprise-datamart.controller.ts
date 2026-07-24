import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { 
  AnalyticalDataset, 
  ProjectionSnapshot, 
  MaterializedView 
} from '../../application/read-models';
import { 
  SnapshotService, 
  MaterializedViewService,
  ProjectionBuilder
} from '../../application/services';

@Controller('enterprise/datamart')
export class EnterpriseDataMartController {
  constructor(
    private readonly snapshotService: SnapshotService,
    private readonly viewService: MaterializedViewService,
    private readonly projectionBuilder: ProjectionBuilder
  ) {}

  @Get('datasets')
  async getDatasets(): Promise<AnalyticalDataset[]> {
    // Mock listing datasets available in the mart
    return [
      await this.snapshotService.createSnapshot('Executive_Dashboard_Dataset'),
      await this.snapshotService.createSnapshot('Sales_Forecast_Dataset')
    ];
  }

  @Get('snapshots')
  async getSnapshots(@Query('dataset') dataset: string): Promise<AnalyticalDataset> {
    return this.snapshotService.createSnapshot(dataset || 'Generic_Dataset');
  }

  @Get('projections')
  async getProjections(): Promise<ProjectionSnapshot[]> {
    return [
      await this.projectionBuilder.buildProjection('Sales_Dim', { metric: 100 }),
      await this.projectionBuilder.buildProjection('Reservations_Fact', { metric: 200 })
    ];
  }

  @Get('views')
  async getViews(@Query('name') name: string): Promise<MaterializedView> {
    return this.viewService.getMaterializedView(name || 'FactSales');
  }

  @Post('refresh')
  async refreshView(@Body() payload: { viewName: string }): Promise<{ success: boolean, message: string }> {
    await this.viewService.refreshView(payload.viewName);
    return { success: true, message: `View ${payload.viewName} refreshed successfully.` };
  }

  @Get('status')
  async getStatus(): Promise<{ status: string, lastSync: Date }> {
    return {
      status: 'HEALTHY',
      lastSync: new Date()
    };
  }
}
