import { ChartData, ChartOptions } from 'chart.js';
import { FinancialData } from './supabase';

export function createFinancialChartData(data: Omit<FinancialData, 'id' | 'created_at'>): ChartData<'bar'> {
  return {
    labels: [
      'Annual Revenue',
      'Gross Profit',
      'Operating Expenses',
      'Net Income',
      'Cash on Hand',
    ],
    datasets: [
      {
        label: 'Financial Metrics',
        data: [
          data.annual_revenue,
          data.gross_profit,
          data.operating_expenses,
          data.net_income,
          data.cash_on_hand,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
}

export function createBalanceSheetData(data: Omit<FinancialData, 'id' | 'created_at'>): ChartData<'pie'> {
  return {
    labels: ['Total Assets', 'Total Liabilities', 'Cash on Hand', 'Annual Recurring Revenue'],
    datasets: [
      {
        data: [
          data.total_assets,
          data.total_liabilities,
          data.cash_on_hand,
          data.annual_recurring_revenue,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
}

export const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Financial Metrics Overview',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export const pieChartOptions: ChartOptions<'pie'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Balance Sheet Overview',
    },
  },
};
