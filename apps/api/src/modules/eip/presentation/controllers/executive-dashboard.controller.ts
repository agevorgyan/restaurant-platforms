import { Controller, Get, Param, Query } from '@nestjs/common';
import { DashboardFilter, DashboardSnapshot, DashboardLayout, DashboardWidget } from '../../application/read-models';
import { DashboardBuilder, PersonalizationService, WidgetCompositionService } from '../../application/services';

@Controller('enterprise/dashboard')
export class ExecutiveDashboardController {
  constructor(
    private readonly dashboardBuilder: DashboardBuilder,
    private readonly personalizationService: PersonalizationService,
    private readonly widgetService: WidgetCompositionService
  ) {}

  @Get()
  async getDashboard(@Query() filter: DashboardFilter): Promise<DashboardSnapshot> {
    // Default to CEO dashboard if no role specified
    return this.dashboardBuilder.buildDashboard('CEO', filter);
  }

  @Get('role/:role')
  async getDashboardForRole(
    @Param('role') role: string, 
    @Query() filter: DashboardFilter
  ): Promise<DashboardSnapshot> {
    return this.dashboardBuilder.buildDashboard(role.toUpperCase(), filter);
  }

  @Get('layout')
  async getDashboardLayout(@Query('role') role: string = 'CEO'): Promise<DashboardLayout> {
    return this.personalizationService.getLayoutForRole(role.toUpperCase());
  }

  @Get('widgets')
  async getDashboardWidgets(@Query() filter: DashboardFilter): Promise<DashboardWidget[]> {
    // Mock available widgets catalog
    const availableWidgets = [
      { id: 'w1', title: 'Total Revenue', type: 'KPI_CARD', dataSource: 'KPI_REVENUE' },
      { id: 'w2', title: 'Labor Cost %', type: 'KPI_CARD', dataSource: 'KPI_LABOR_COST' }
    ];
    
    return Promise.all(
      availableWidgets.map(cfg => this.widgetService.buildWidget(cfg, filter))
    );
  }
}
