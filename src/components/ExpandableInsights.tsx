'use client';

import { useState } from 'react';
import { DetailedInsights, FinancialKPIs } from '@/types/financial';

interface ExpandableInsightsProps {
  basicInsights: string[];
  detailedInsights?: DetailedInsights;
  isLoading?: boolean;
}

export default function ExpandableInsights({ 
  basicInsights, 
  detailedInsights, 
  isLoading = false 
}: ExpandableInsightsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const formatRatio = (value: number, isPercentage = true) => {
    if (isPercentage) {
      return `${(value * 100).toFixed(1)}%`;
    }
    return value.toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        {/* Basic Insights Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
            <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Financial Analysis Report
          </h2>
          <button
            onClick={toggleExpanded}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
          >
            <span className="text-blue-700 font-medium">
              {isExpanded ? 'Show Less' : 'Detailed Analysis'}
            </span>
            {isExpanded ? (
              <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>

        {/* Basic Insights */}
        <div className="space-y-6 mb-6">
          {basicInsights.map((insight, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-100">
              <div className="flex items-start">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-semibold mr-4 mt-1 flex-shrink-0">
                  {index + 1}
                </span>
                <p className="text-gray-700 leading-relaxed">{insight}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Expandable Detailed Section */}
        {isExpanded && (
          <div className="border-t border-gray-200 pt-8 animate-in slide-in-from-top-2 duration-300">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading detailed analysis...</span>
              </div>
            ) : detailedInsights ? (
              <div className="space-y-8">
                {/* Financial Ratios */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l6-1v10M9 19c0 1.1-1.1 2-2.5 2S4 20.1 4 19s1.1-2 2.5-2 2.5.9 2.5 2zm0 0V9M15 15c0 1.1-1.1 2-2.5 2s-2.5-.9-2.5-2 1.1-2 2.5-2 2.5.9 2.5 2z" />
                    </svg>
                    Key Financial Ratios
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                      <div className="text-sm text-green-700 font-medium">Revenue Growth</div>
                      <div className="text-2xl font-bold text-green-900">{formatRatio(detailedInsights.ratios.revenue_growth)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-700 font-medium">Profit Margin</div>
                      <div className="text-2xl font-bold text-blue-900">{formatRatio(detailedInsights.ratios.profit_margin)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                      <div className="text-sm text-purple-700 font-medium">Current Ratio</div>
                      <div className="text-2xl font-bold text-purple-900">{formatRatio(detailedInsights.ratios.current_ratio, false)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                      <div className="text-sm text-orange-700 font-medium">Debt to Equity</div>
                      <div className="text-2xl font-bold text-orange-900">{formatRatio(detailedInsights.ratios.debt_to_equity, false)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
                      <div className="text-sm text-indigo-700 font-medium">Return on Assets</div>
                      <div className="text-2xl font-bold text-indigo-900">{formatRatio(detailedInsights.ratios.roa)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
                      <div className="text-sm text-pink-700 font-medium">Return on Equity</div>
                      <div className="text-2xl font-bold text-pink-900">{formatRatio(detailedInsights.ratios.roe)}</div>
                    </div>
                  </div>
                </div>

                {/* Trends */}
                {detailedInsights.trends.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Market Trends & Patterns
                    </h3>
                    <div className="space-y-3">
                      {detailedInsights.trends.map((trend, index) => (
                        <div key={index} className="flex items-start bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                          </svg>
                          <p className="text-blue-800">{trend}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {detailedInsights.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                      </svg>
                      Strategic Recommendations
                    </h3>
                    <div className="space-y-3">
                      {detailedInsights.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start bg-green-50 p-4 rounded-lg border border-green-200">
                          <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <p className="text-green-800">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risk Assessment */}
                {detailedInsights.risks.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Risk Assessment
                    </h3>
                    <div className="space-y-3">
                      {detailedInsights.risks.map((risk, index) => (
                        <div key={index} className="flex items-start bg-red-50 p-4 rounded-lg border border-red-200">
                          <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-red-800">{risk}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No detailed analysis available. Submit financial data to generate comprehensive insights.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
