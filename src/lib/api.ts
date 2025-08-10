import { supabase } from './supabase';
import type { FinancialData } from './supabase';

export async function submitFinancialData(data: Omit<FinancialData, 'id' | 'created_at'>) {
  try {
    const { data: result, error } = await supabase
      .from('Financials')
      .insert([data])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return result;
  } catch (error) {
    console.error('Error submitting financial data:', error);
    throw error;
  }
}
