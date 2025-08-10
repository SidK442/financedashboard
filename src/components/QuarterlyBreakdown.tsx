'use client';

import { useState, useEffect } from 'react';
import { QuarterlyData } from '@/types/financial';

interface QuarterlyBreakdownProps {
  className?: string;
  initialData?: {
    revenue: QuarterlyData;
    profit: QuarterlyData;
    expenses: QuarterlyData;
  };
}

export default function QuarterlyBreakdown({ className = '', initialData }: QuarterlyBreakdownProps) {
  const [data, setData] = useState({
    revenue: { q1: 0, q2: 0, q3: 0, q4: 0 },
    profit: { q1: 0, q2: 0, q3: 0, q4: 0 },
    expenses: { q1: 0, q2: 0, q3: 0, q4: 0 }
  });

  const [editMode, setEditMode] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const updateQuarterValue = (category: 'revenue' | 'profit' | 'expenses', quarter: keyof QuarterlyData, value: number) => {
    setData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [quarter]: value
      }
    }));
  };

  const calculateTotal = (quarterlyData: QuarterlyData) => {
    return quarterlyData.q1 + quarterlyData.q2 + quarterlyData.q3 + quarterlyData.q4;
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) {
      return (
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    }
    if (growth < 0) {
      return (
        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4-4-6 6" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    );
  };

  const quarters = [
    { key: 'q1' as keyof QuarterlyData, label: 'Q1', months: 'Jan-Mar' },
    { key: 'q2' as keyof QuarterlyData, label: 'Q2', months: 'Apr-Jun' },
    { key: 'q3' as keyof QuarterlyData, label: 'Q3', months: 'Jul-Sep' },
    { key: 'q4' as keyof QuarterlyData, label: 'Q4', months: 'Oct-Dec' }
  ];

  const categories = [
    { 
      key: 'revenue' as const, 
      label: 'Revenue', 
      color: 'bg-green-50 border-green-200', 
      headerColor: 'bg-green-100',
      textColor: 'text-green-800'
    },
    { 
      key: 'profit' as const, 
      label: 'Net Profit', 
      color: 'bg-blue-50 border-blue-200', 
      headerColor: 'bg-blue-100',
      textColor: 'text-blue-800'
    },
    { 
      key: 'expenses' as const, 
      label: 'Operating Expenses', 
      color: 'bg-orange-50 border-orange-200', 
      headerColor: 'bg-orange-100',
      textColor: 'text-orange-800'
    }
  ];

  return (
    <div className={`max-w-6xl mx-auto px-4 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
            <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Quarterly Financial Breakdown
          </h2>
          
          <div className="flex items-center">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                editMode 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {editMode ? 'Save Changes' : 'Edit Data'}
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {categories.map(category => {
            const total = calculateTotal(data[category.key]);
            const q4Growth = calculateGrowth(data[category.key].q4, data[category.key].q3);
            
            return (
              <div key={category.key} className={`p-6 rounded-lg border-2 ${category.color}`}>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${category.headerColor} ${category.textColor}`}>
                  {category.label}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${total.toLocaleString()}
                </div>
                <div className="flex items-center space-x-1">
                  {getGrowthIcon(q4Growth)}
                  <span className={`text-sm font-medium ${getGrowthColor(q4Growth)}`}>
                    {q4Growth >= 0 ? '+' : ''}{q4Growth.toFixed(1)}% from Q3
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quarterly Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4 border border-gray-200 font-semibold text-gray-900">Category</th>
                {quarters.map(quarter => (
                  <th key={quarter.key} className="text-center p-4 border border-gray-200 font-semibold text-gray-900">
                    <div>{quarter.label}</div>
                    <div className="text-xs text-gray-500 font-normal">{quarter.months}</div>
                  </th>
                ))}
                <th className="text-center p-4 border border-gray-200 font-semibold text-gray-900">Total</th>
                <th className="text-center p-4 border border-gray-200 font-semibold text-gray-900">Avg/Quarter</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => {
                const total = calculateTotal(data[category.key]);
                const average = total / 4;
                
                return (
                  <tr key={category.key} className={`${category.color} hover:opacity-80 transition-opacity duration-200`}>
                    <td className="p-4 border border-gray-200 font-medium text-gray-900">
                      {category.label}
                    </td>
                    {quarters.map(quarter => {
                      const value = data[category.key][quarter.key];
                      const prevQuarter = quarter.key === 'q1' ? 'q4' : 
                                        quarter.key === 'q2' ? 'q1' : 
                                        quarter.key === 'q3' ? 'q2' : 'q3';
                      const growth = quarter.key !== 'q1' ? 
                        calculateGrowth(value, data[category.key][prevQuarter as keyof QuarterlyData]) : 0;
                      
                      return (
                        <td key={quarter.key} className="p-4 border border-gray-200 text-center">
                          {editMode ? (
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => updateQuarterValue(category.key, quarter.key, Number(e.target.value) || 0)}
                              className="w-24 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <div>
                              <div className="font-semibold text-gray-900">
                                ${value.toLocaleString('en-US', { 
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0 
                                })}
                              </div>
                              {quarter.key !== 'q1' && (
                                <div className={`text-xs flex items-center justify-center space-x-1 mt-1 ${getGrowthColor(growth)}`}>
                                  {getGrowthIcon(growth)}
                                  <span>{growth >= 0 ? '+' : ''}{growth.toFixed(1)}%</span>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-4 border border-gray-200 text-center font-bold text-gray-900">
                      ${total.toLocaleString()}
                    </td>
                    <td className="p-4 border border-gray-200 text-center font-medium text-gray-700">
                      ${average.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Visual Chart */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quarterly Trends</h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="space-y-6">
              {categories.map(category => {
                const maxValue = Math.max(...Object.values(data[category.key]));
                
                return (
                  <div key={category.key}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${category.textColor}`}>{category.label}</span>
                      <span className="text-sm text-gray-500">Max: ${maxValue.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {quarters.map(quarter => {
                        const value = data[category.key][quarter.key];
                        const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                        
                        return (
                          <div key={quarter.key} className="text-center">
                            <div className="mb-3">
                              <div 
                                className={`w-full rounded-t-lg transition-all duration-500 ${
                                  category.key === 'revenue' ? 'bg-green-400' :
                                  category.key === 'profit' ? 'bg-blue-400' : 'bg-orange-400'
                                }`}
                                style={{ 
                                  height: `${Math.max(percentage, 5)}px`,
                                  maxHeight: '100px'
                                }}
                              ></div>
                              <div className="text-xs text-gray-600 mt-2 font-medium">{quarter.label}</div>
                              <div className="text-sm font-semibold text-gray-900 mt-1 px-1 leading-tight">
                                ${value.toLocaleString('en-US', { 
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {editMode && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-800 font-medium">Edit Mode Active</span>
            </div>
            <p className="text-blue-700 text-sm mt-1">
              Click on any value in the table to edit it. Changes are saved automatically. Click &quot;Save Changes&quot; when done.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
