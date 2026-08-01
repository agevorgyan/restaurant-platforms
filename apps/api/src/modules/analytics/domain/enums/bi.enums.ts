/**
 * Enterprise Business Intelligence Platform - Domain Enums
 *
 * Defines core enums for OLAP cubes, analysis types, business dimensions,
 * financial/operational measures, and drill navigation modes.
 */

export enum CubeStatus {
  DRAFT = 'DRAFT',
  BUILDING = 'BUILDING',
  READY = 'READY',
  DEPRECATED = 'DEPRECATED',
  ARCHIVED = 'ARCHIVED',
}

export enum DrillMode {
  DRILL_DOWN = 'DRILL_DOWN',
  DRILL_UP = 'DRILL_UP',
  DRILL_THROUGH = 'DRILL_THROUGH',
  SLICE = 'SLICE',
  DICE = 'DICE',
  PIVOT = 'PIVOT',
}

export enum AnalysisType {
  OPERATIONAL = 'OPERATIONAL',
  FINANCIAL = 'FINANCIAL',
  SALES = 'SALES',
  INVENTORY = 'INVENTORY',
  CUSTOMER = 'CUSTOMER',
  EMPLOYEE = 'EMPLOYEE',
  MARKETING = 'MARKETING',
  EXECUTIVE = 'EXECUTIVE',
}

export enum DimensionType {
  TIME = 'TIME',
  RESTAURANT = 'RESTAURANT',
  REGION = 'REGION',
  DEPARTMENT = 'DEPARTMENT',
  EMPLOYEE = 'EMPLOYEE',
  CUSTOMER = 'CUSTOMER',
  PRODUCT = 'PRODUCT',
  SUPPLIER = 'SUPPLIER',
  CHANNEL = 'CHANNEL',
  PROMOTION = 'PROMOTION',
}

export enum MeasureType {
  REVENUE = 'REVENUE',
  ORDERS = 'ORDERS',
  PROFIT = 'PROFIT',
  COST = 'COST',
  MARGIN = 'MARGIN',
  INVENTORY_VALUE = 'INVENTORY_VALUE',
  CUSTOMER_COUNT = 'CUSTOMER_COUNT',
  EMPLOYEE_HOURS = 'EMPLOYEE_HOURS',
}

export enum AggregationLevel {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  QUARTER = 'QUARTER',
  YEAR = 'YEAR',
}
