export interface FinancialDataRecord {
  id: string;
  created_at: string;
  annual_revenue: number;
  gross_profit: number;
  operating_expenses: number;
  net_income: number;
  cash_on_hand: number;
  total_assets: number;
  total_liabilities: number;
  annual_recurring_revenue: number;
  number_of_employees: number;
}

export type FinancialDataInput = Omit<FinancialDataRecord, 'id' | 'created_at'>;

export interface FinancialAnalysis {
  data: FinancialDataRecord;
  insights: string;
}

export interface QuarterlyData {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
}

export interface KPI {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  category: 'revenue' | 'growth' | 'efficiency' | 'profitability';
}

export interface FinancialKPIs {
  revenue_growth: number;
  profit_margin: number;
  current_ratio: number;
  debt_to_equity: number;
  roa: number; // Return on Assets
  roe: number; // Return on Equity
}

export interface DetailedInsights {
  ratios: FinancialKPIs;
  trends: string[];
  recommendations: string[];
  risks: string[];
}
