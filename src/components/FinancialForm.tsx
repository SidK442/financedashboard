'use client';

import { useState } from 'react';
import type { FinancialData } from '../lib/supabase';

type FinancialFormProps = {
  onSubmitAction: (data: Omit<FinancialData, 'id' | 'created_at'>) => Promise<void>;
};

export default function FinancialForm({ onSubmitAction }: FinancialFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      annual_revenue: Number(formData.get('annual_revenue')),
      annual_recurring_revenue: Number(formData.get('annual_recurring_revenue')),
      gross_profit: Number(formData.get('gross_profit')),
      operating_expenses: Number(formData.get('operating_expenses')),
      net_income: Number(formData.get('net_income')),
      cash_on_hand: Number(formData.get('cash_on_hand')),
      total_assets: Number(formData.get('total_assets')),
      total_liabilities: Number(formData.get('total_liabilities')),
      number_of_employees: Number(formData.get('number_of_employees')),
    };

    try {
      // Save to Supabase
      const savedData = await onSubmitAction(data);
      
      // Get AI analysis
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI analysis');
      }

      const { insights } = await response.json();

      // Redirect to results page with data and insights
      const searchParams = new URLSearchParams({
        data: encodeURIComponent(JSON.stringify(data)),
        insights: encodeURIComponent(insights),
      });

      window.location.href = `/results?${searchParams.toString()}`;
    } catch (error) {
      console.error('Error processing data:', error);
      alert('Failed to process data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
  <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300">

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {[
            { label: 'Annual Revenue', id: 'annual_revenue' },
            { label: 'Annual Recurring Revenue', id: 'annual_recurring_revenue' },
            { label: 'Gross Profit', id: 'gross_profit' },
            { label: 'Operating Expenses', id: 'operating_expenses' },
            { label: 'Net Income', id: 'net_income' },
            { label: 'Cash on Hand', id: 'cash_on_hand' },
            { label: 'Total Assets', id: 'total_assets' },
            { label: 'Total Liabilities', id: 'total_liabilities' }
          ].map((field) => (
            <div key={field.id} className="group">
              <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {field.label}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-lg group-hover:text-blue-800 dark:group-hover:text-blue-300 group-hover:scale-110 transition-all duration-200">$</span>
                </div>
                <input
                  type="number"
                  name={field.id}
                  id={field.id}
                  required
                  min="0"
                  step="0.01"
                  className="block w-full rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white pl-8 pr-12 focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 sm:text-sm transition-all hover:border-blue-300 dark:hover:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Centered Employee Field */}
        <div className="flex justify-center mt-6">
          <div className="group w-full max-w-md">
            <label htmlFor="number_of_employees" className="block text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-center">
              Estimate Number of Employees
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                name="number_of_employees"
                id="number_of_employees"
                required
                min="0"
                step="1"
                className="block w-full rounded-md border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white pr-12 focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 sm:text-sm transition-all hover:border-blue-300 dark:hover:border-blue-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Generate Financial Insights'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
