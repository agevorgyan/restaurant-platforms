export interface KpiSnapshot {
  kpiId: string;
  code: string;
  name: string;
  category: string;
  value: number;
  unit: string;
  timestamp: Date;
  period: string;
  trendDirection: string;
  trendPercentage: number;
  target?: number;
}

export interface KpiHistory {
  kpiId: string;
  code: string;
  period: string;
  dataPoints: {
    timestamp: Date;
    value: number;
  }[];
}

export interface KpiTrend {
  kpiId: string;
  code: string;
  currentValue: number;
  previousValue: number;
  trendDirection: string;
  changePercentage: number;
  timeframe: string;
}

export interface KpiBenchmark {
  kpiId: string;
  code: string;
  currentValue: number;
  industryAverage: number;
  percentileRank: number;
  status: 'BELOW_AVERAGE' | 'AVERAGE' | 'ABOVE_AVERAGE' | 'TOP_PERFORMER';
}
