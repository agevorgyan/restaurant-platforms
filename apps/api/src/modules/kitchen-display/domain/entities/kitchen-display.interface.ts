import { DisplayLayout } from '../value-objects/display-layout.value-object';
import { DisplayConfiguration } from '../value-objects/display-configuration.value-object';
import { DisplayRefreshPolicy } from '../value-objects/display-refresh-policy.value-object';
import { DisplayFilter } from '../value-objects/display-filter.value-object';
import { DisplayStatus } from '../value-objects/display-status.value-object';

export interface IKitchenDisplay {
  id: string;
  restaurantId: string;
  branchId: string;
  kitchenId: string;
  stationId: string;
  name: string;
  layout: DisplayLayout;
  configuration: DisplayConfiguration;
  refreshPolicy: DisplayRefreshPolicy;
  filters: DisplayFilter;
  status: DisplayStatus;
  createdAt: Date;
  updatedAt: Date;
}
