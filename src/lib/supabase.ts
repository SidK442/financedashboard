import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type FinancialData = {
  id?: string;
  created_at?: string;
  annual_revenue: number;
  annual_recurring_revenue: number;
  gross_profit: number;
  operating_expenses: number;
  net_income: number;
  cash_on_hand: number;
  total_assets: number;
  total_liabilities: number;
  number_of_employees: number;
};
