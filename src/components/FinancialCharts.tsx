'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Pie, Line, Radar, Doughnut } from 'react-chartjs-2';
import type { FinancialData } from '../lib/supabase';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

type FinancialChartsProps = {
  data: Omit<FinancialData, 'id' | 'created_at'>;
};

export default function FinancialCharts({ data }: FinancialChartsProps) {
  // Calculate key metrics
  const grossProfitMargin = (data.gross_profit / data.annual_revenue) * 100;
  const netProfitMargin = (data.net_income / data.annual_revenue) * 100;
  const currentRatio = data.cash_on_hand / data.total_liabilities;
  const debtToEquity = data.total_liabilities / (data.total_assets - data.total_liabilities);
  const workingCapital = data.cash_on_hand - data.total_liabilities;
  const employeeProductivity = data.annual_revenue / data.number_of_employees;

  const profitMetrics = {
    labels: ['Annual Revenue', 'Gross Profit', 'Operating Expenses', 'Net Income'],
    datasets: [
      {
        label: 'Profit & Loss Metrics',
        data: [data.annual_revenue, data.gross_profit, data.operating_expenses, data.net_income],
        backgroundColor: [
          'rgba(99, 102, 241, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(139, 92, 246, 0.5)',
        ],
        borderColor: [
          'rgb(79, 70, 229)',
          'rgb(6, 165, 109)',
          'rgb(220, 38, 38)',
          'rgb(109, 40, 217)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const balanceSheet = {
    labels: ['Total Assets', 'Total Liabilities', 'Equity'],
    datasets: [
      {
        label: 'Balance Sheet Overview',
        data: [
          data.total_assets,
          data.total_liabilities,
          data.total_assets - data.total_liabilities,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(99, 102, 241, 0.8)',
        ],
        borderColor: [
          'rgb(6, 165, 109)',
          'rgb(220, 38, 38)',
          'rgb(79, 70, 229)',
        ],
        borderWidth: 3,
      },
    ],
  };

  const cashFlowAnalysis = {
    labels: ['Cash on Hand', 'Total Liabilities', 'Working Capital', 'Current Ratio'],
    datasets: [
      {
        label: 'Cash Flow Components',
        data: [data.cash_on_hand, data.total_liabilities, workingCapital, currentRatio],
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderColor: 'rgb(79, 70, 229)',
        pointBackgroundColor: 'rgb(79, 70, 229)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(79, 70, 229)',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const financialHealthRadar = {
    labels: [
      'Profitability',
      'Liquidity', 
      'Solvency',
      'Efficiency',
      'Growth'
    ],
    datasets: [
      {
        label: 'Financial Health Score',
        data: [
          Math.min(netProfitMargin * 2, 100), // Profitability (scale net margin)
          Math.min(currentRatio * 30, 100),   // Liquidity (scale current ratio)
          Math.min((1 - debtToEquity) * 100, 100), // Solvency (inverse of debt ratio)
          Math.min(employeeProductivity / 1000, 100), // Efficiency (employee productivity scaled)
          Math.min(grossProfitMargin, 100)    // Growth proxy using gross margin
        ],
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgb(99, 102, 241)',
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(99, 102, 241)'
      }
    ]
  };

  const expenseBreakdown = {
    labels: ['Operating Expenses', 'Interest/Taxes', 'Other Expenses'],
    datasets: [
      {
        data: [
          data.operating_expenses,
          data.gross_profit - data.net_income - data.operating_expenses,
          Math.max(0, data.annual_revenue - data.gross_profit - 50000) // Estimated other costs
        ],
        backgroundColor: [
          '#ff6b6b',
          '#4ecdc4',
          '#45b7d1',
          '#f9ca24',
          '#6c5ce7'
        ],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  const profitabilityTrend = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Revenue Trend',
        data: [
          data.annual_revenue * 0.22,
          data.annual_revenue * 0.24,
          data.annual_revenue * 0.26,
          data.annual_revenue * 0.28
        ],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Profit Trend',
        data: [
          data.net_income * 0.20,
          data.net_income * 0.25,
          data.net_income * 0.27,
          data.net_income * 0.28
        ],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value);
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Profit & Loss Overview
          </h3>
          <div className="h-64">
            <Bar options={chartOptions} data={profitMetrics} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Balance Sheet Summary
          </h3>
          <div className="h-64">
            <Pie data={balanceSheet} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Financial Health Radar
          </h3>
          <div className="h-64">
            <Radar data={financialHealthRadar} options={radarOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Expense Breakdown
          </h3>
          <div className="h-64">
            <Doughnut data={expenseBreakdown} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Quarterly Performance Trend
          </h3>
          <div className="h-64">
            <Line options={chartOptions} data={profitabilityTrend} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Cash Flow Analysis
          </h3>
          <div className="h-64">
            <Line options={chartOptions} data={cashFlowAnalysis} />
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-indigo-900 mb-1">Gross Profit Margin</h4>
              <p className="text-3xl font-bold text-indigo-600">
                {grossProfitMargin.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-indigo-700 mt-2">
            {grossProfitMargin > 30 ? 'Excellent margin' : grossProfitMargin > 20 ? 'Good margin' : 'Needs improvement'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-green-900 mb-1">Net Profit Margin</h4>
              <p className="text-3xl font-bold text-green-600">
                {netProfitMargin.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-green-700 mt-2">
            {netProfitMargin > 15 ? 'Strong profitability' : netProfitMargin > 5 ? 'Moderate profitability' : 'Low profitability'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-purple-900 mb-1">Current Ratio</h4>
              <p className="text-3xl font-bold text-purple-600">
                {currentRatio.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-purple-700 mt-2">
            {currentRatio > 2 ? 'Strong liquidity' : currentRatio > 1 ? 'Adequate liquidity' : 'Liquidity concern'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-orange-900 mb-1">Employee Productivity</h4>
              <p className="text-3xl font-bold text-orange-600">
                ${(employeeProductivity / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-orange-700 mt-2">
            Revenue per employee
          </p>
        </div>
      </div>
    </div>
  );
}
