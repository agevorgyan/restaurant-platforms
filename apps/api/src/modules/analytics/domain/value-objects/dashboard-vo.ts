/**
 * Enterprise Dashboard Platform - Value Objects
 *
 * Immutable Value Objects encapsulating dashboard domain concepts, identity,
 * positioning, dimensioning, refresh policies, filters, layouts, themes, and widget definitions.
 */

import {
  LayoutType,
  RefreshStrategy,
  WidgetType,
} from '../enums/dashboard.enums';
import {
  InvalidDashboardLayoutException,
  InvalidRefreshPolicyException,
  InvalidWidgetDefinitionException,
} from '../exceptions/dashboard.exceptions';

/**
 * DashboardId Value Object
 */
export class DashboardId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('DashboardId cannot be empty');
    }
    this.value = value;
  }

  public static create(id?: string): DashboardId {
    return new DashboardId(id || `dash-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
  }

  public static fromString(id: string): DashboardId {
    return new DashboardId(id);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: DashboardId): boolean {
    return this.value === other.getValue();
  }
}

/**
 * WidgetId Value Object
 */
export class WidgetId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('WidgetId cannot be empty');
    }
    this.value = value;
  }

  public static create(id?: string): WidgetId {
    return new WidgetId(id || `widg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
  }

  public static fromString(id: string): WidgetId {
    return new WidgetId(id);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: WidgetId): boolean {
    return this.value === other.getValue();
  }
}

/**
 * DashboardVersion Value Object
 * Supports semantic versioning (Major.Minor)
 */
export class DashboardVersion {
  private readonly major: number;
  private readonly minor: number;

  private constructor(major: number, minor: number) {
    if (major < 0 || minor < 0) {
      throw new Error('DashboardVersion numbers must be non-negative');
    }
    this.major = major;
    this.minor = minor;
  }

  public static initial(): DashboardVersion {
    return new DashboardVersion(1, 0);
  }

  public static create(major: number, minor: number): DashboardVersion {
    return new DashboardVersion(major, minor);
  }

  public static parse(versionStr: string): DashboardVersion {
    const parts = versionStr.split('.');
    if (parts.length !== 2) {
      throw new Error(`Invalid version string format: ${versionStr}`);
    }
    const major = parseInt(parts[0], 10);
    const minor = parseInt(parts[1], 10);
    if (isNaN(major) || isNaN(minor)) {
      throw new Error(`Invalid numeric version components in: ${versionStr}`);
    }
    return new DashboardVersion(major, minor);
  }

  public incrementMinor(): DashboardVersion {
    return new DashboardVersion(this.major, this.minor + 1);
  }

  public incrementMajor(): DashboardVersion {
    return new DashboardVersion(this.major + 1, 0);
  }

  public toString(): string {
    return `${this.major}.${this.minor}`;
  }

  public equals(other: DashboardVersion): boolean {
    return this.major === other.major && this.minor === other.minor;
  }
}

/**
 * WidgetPosition Value Object
 */
export class WidgetPosition {
  public readonly x: number;
  public readonly y: number;
  public readonly zIndex: number;

  private constructor(x: number, y: number, zIndex: number) {
    if (x < 0 || y < 0) {
      throw new InvalidDashboardLayoutException('Widget position coordinates (x, y) must be non-negative');
    }
    this.x = x;
    this.y = y;
    this.zIndex = zIndex;
  }

  public static create(x: number, y: number, zIndex: number = 0): WidgetPosition {
    return new WidgetPosition(x, y, zIndex);
  }
}

/**
 * WidgetSize Value Object
 */
export class WidgetSize {
  public readonly width: number;
  public readonly height: number;
  public readonly minWidth: number;
  public readonly minHeight: number;
  public readonly maxWidth: number;
  public readonly maxHeight: number;

  private constructor(props: {
    width: number;
    height: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
  }) {
    if (props.width <= 0 || props.height <= 0) {
      throw new InvalidDashboardLayoutException('Widget size dimensions must be greater than zero');
    }
    this.width = props.width;
    this.height = props.height;
    this.minWidth = props.minWidth ?? 1;
    this.minHeight = props.minHeight ?? 1;
    this.maxWidth = props.maxWidth ?? 12;
    this.maxHeight = props.maxHeight ?? 12;
  }

  public static create(props: {
    width: number;
    height: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
  }): WidgetSize {
    return new WidgetSize(props);
  }
}

/**
 * RefreshPolicy Value Object
 */
export class RefreshPolicy {
  public readonly strategy: RefreshStrategy;
  public readonly intervalSeconds: number;
  public readonly eventTriggers: string[];
  public readonly realtimeTopic?: string;

  private constructor(props: {
    strategy: RefreshStrategy;
    intervalSeconds?: number;
    eventTriggers?: string[];
    realtimeTopic?: string;
  }) {
    this.strategy = props.strategy;
    this.intervalSeconds = props.intervalSeconds ?? 0;
    this.eventTriggers = props.eventTriggers ?? [];
    this.realtimeTopic = props.realtimeTopic;

    if (this.strategy === RefreshStrategy.INTERVAL && this.intervalSeconds <= 0) {
      throw new InvalidRefreshPolicyException('Interval refresh strategy requires intervalSeconds > 0');
    }
  }

  public static create(props: {
    strategy: RefreshStrategy;
    intervalSeconds?: number;
    eventTriggers?: string[];
    realtimeTopic?: string;
  }): RefreshPolicy {
    return new RefreshPolicy(props);
  }

  public static manual(): RefreshPolicy {
    return new RefreshPolicy({ strategy: RefreshStrategy.MANUAL });
  }

  public static realtime(topic: string): RefreshPolicy {
    return new RefreshPolicy({ strategy: RefreshStrategy.REALTIME, realtimeTopic: topic });
  }
}

/**
 * DashboardFilter Value Object
 */
export class DashboardFilter {
  public readonly filterId: string;
  public readonly name: string;
  public readonly field: string;
  public readonly targetWidgetIds: string[];
  public readonly filterType: 'SELECT' | 'DATE_RANGE' | 'MULTI_SELECT' | 'TEXT' | 'NUMERIC_RANGE';
  public readonly defaultValue?: unknown;
  public readonly options?: string[];

  private constructor(props: {
    filterId?: string;
    name: string;
    field: string;
    targetWidgetIds?: string[];
    filterType: 'SELECT' | 'DATE_RANGE' | 'MULTI_SELECT' | 'TEXT' | 'NUMERIC_RANGE';
    defaultValue?: unknown;
    options?: string[];
  }) {
    if (!props.name || !props.field) {
      throw new Error('DashboardFilter requires a valid name and field');
    }
    this.filterId = props.filterId || `fltr-${Math.random().toString(36).substring(2, 7)}`;
    this.name = props.name;
    this.field = props.field;
    this.targetWidgetIds = props.targetWidgetIds || [];
    this.filterType = props.filterType;
    this.defaultValue = props.defaultValue;
    this.options = props.options || [];
  }

  public static create(props: {
    filterId?: string;
    name: string;
    field: string;
    targetWidgetIds?: string[];
    filterType: 'SELECT' | 'DATE_RANGE' | 'MULTI_SELECT' | 'TEXT' | 'NUMERIC_RANGE';
    defaultValue?: unknown;
    options?: string[];
  }): DashboardFilter {
    return new DashboardFilter(props);
  }
}

/**
 * BI Query Binding metadata structure (widgets consume BI queries, NOT raw repositories)
 */
export interface BiQueryBinding {
  cubeId?: string;
  analysisType?: string;
  selectedDimensions: string[];
  selectedMeasures: string[];
  filters?: Record<string, unknown>;
  groupBy?: string[];
  orderBy?: string;
  limit?: number;
}

/**
 * KPI Binding metadata structure
 */
export interface KpiBinding {
  kpiId: string;
  kpiCode: string;
  targetThreshold?: number;
  period?: string;
}

/**
 * WidgetDefinition Value Object
 */
export class WidgetDefinition {
  public readonly widgetId: WidgetId;
  public readonly type: WidgetType;
  public readonly title: string;
  public readonly subtitle?: string;
  public readonly position: WidgetPosition;
  public readonly size: WidgetSize;
  public readonly refreshPolicy: RefreshPolicy;
  public readonly biQueryBinding?: BiQueryBinding;
  public readonly kpiBinding?: KpiBinding;
  public readonly requiredRoles?: string[];
  public readonly customProps?: Record<string, unknown>;

  private constructor(props: {
    widgetId?: WidgetId;
    type: WidgetType;
    title: string;
    subtitle?: string;
    position: WidgetPosition;
    size: WidgetSize;
    refreshPolicy?: RefreshPolicy;
    biQueryBinding?: BiQueryBinding;
    kpiBinding?: KpiBinding;
    requiredRoles?: string[];
    customProps?: Record<string, unknown>;
  }) {
    if (!props.title || props.title.trim().length === 0) {
      throw new InvalidWidgetDefinitionException('Widget title cannot be empty');
    }
    this.widgetId = props.widgetId || WidgetId.create();
    this.type = props.type;
    this.title = props.title;
    this.subtitle = props.subtitle;
    this.position = props.position;
    this.size = props.size;
    this.refreshPolicy = props.refreshPolicy || RefreshPolicy.manual();
    this.biQueryBinding = props.biQueryBinding;
    this.kpiBinding = props.kpiBinding;
    this.requiredRoles = props.requiredRoles || [];
    this.customProps = props.customProps || {};
  }

  public static create(props: {
    widgetId?: WidgetId;
    type: WidgetType;
    title: string;
    subtitle?: string;
    position: WidgetPosition;
    size: WidgetSize;
    refreshPolicy?: RefreshPolicy;
    biQueryBinding?: BiQueryBinding;
    kpiBinding?: KpiBinding;
    requiredRoles?: string[];
    customProps?: Record<string, unknown>;
  }): WidgetDefinition {
    return new WidgetDefinition(props);
  }
}

/**
 * DashboardLayout Value Object
 */
export class DashboardLayout {
  public readonly layoutType: LayoutType;
  public readonly columns: number;
  public readonly rowHeightPx: number;
  public readonly gapPx: number;
  public readonly responsiveBreakpoints?: Record<string, number>;

  private constructor(props: {
    layoutType: LayoutType;
    columns?: number;
    rowHeightPx?: number;
    gapPx?: number;
    responsiveBreakpoints?: Record<string, number>;
  }) {
    this.layoutType = props.layoutType;
    this.columns = props.columns ?? 12;
    this.rowHeightPx = props.rowHeightPx ?? 80;
    this.gapPx = props.gapPx ?? 16;
    this.responsiveBreakpoints = props.responsiveBreakpoints || {
      lg: 1200,
      md: 996,
      sm: 768,
      xs: 480,
    };
  }

  public static create(props: {
    layoutType: LayoutType;
    columns?: number;
    rowHeightPx?: number;
    gapPx?: number;
    responsiveBreakpoints?: Record<string, number>;
  }): DashboardLayout {
    return new DashboardLayout(props);
  }

  public static defaultGrid(): DashboardLayout {
    return new DashboardLayout({ layoutType: LayoutType.GRID, columns: 12 });
  }
}

/**
 * DashboardTheme Value Object
 */
export class DashboardTheme {
  public readonly mode: 'LIGHT' | 'DARK' | 'SYSTEM';
  public readonly colorScheme: string;
  public readonly primaryColor: string;
  public readonly cardStyle: 'DEFAULT' | 'BORDERED' | 'GLASS' | 'MINIMAL';
  public readonly fontFamily: string;

  private constructor(props: {
    mode?: 'LIGHT' | 'DARK' | 'SYSTEM';
    colorScheme?: string;
    primaryColor?: string;
    cardStyle?: 'DEFAULT' | 'BORDERED' | 'GLASS' | 'MINIMAL';
    fontFamily?: string;
  }) {
    this.mode = props.mode || 'DARK';
    this.colorScheme = props.colorScheme || 'slate';
    this.primaryColor = props.primaryColor || '#6366f1';
    this.cardStyle = props.cardStyle || 'GLASS';
    this.fontFamily = props.fontFamily || 'Inter, sans-serif';
  }

  public static create(props: {
    mode?: 'LIGHT' | 'DARK' | 'SYSTEM';
    colorScheme?: string;
    primaryColor?: string;
    cardStyle?: 'DEFAULT' | 'BORDERED' | 'GLASS' | 'MINIMAL';
    fontFamily?: string;
  }): DashboardTheme {
    return new DashboardTheme(props);
  }

  public static defaultTheme(): DashboardTheme {
    return new DashboardTheme({});
  }
}
