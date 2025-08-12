'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import FinancialCharts from '@/components/FinancialCharts';
import ExpandableInsights from '@/components/ExpandableInsights';
import KPITracker from '@/components/KPITracker';
import QuarterlyBreakdown from '@/components/QuarterlyBreakdown';
import type { FinancialData } from '@/lib/supabase';
import { DetailedInsights } from '@/types/financial';

export default function ResultsPage() {
  const [insights, setInsights] = useState<string[]>([]);
  const [detailedInsights, setDetailedInsights] = useState<DetailedInsights | null>(null);
  const [chartData, setChartData] = useState<Omit<FinancialData, 'id' | 'created_at'> | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'kpi' | 'quarterly'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const pdfRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts
    
    // Get data from sessionStorage
    const financialDataStr = sessionStorage.getItem('financialData');
    const aiInsightsStr = sessionStorage.getItem('aiInsights');

    if (!financialDataStr || !aiInsightsStr) {
      // If no data, redirect back to home
      if (isMounted) {
        router.push('/');
      }
      return;
    }

    try {
      const financialData = JSON.parse(financialDataStr);
      const aiInsights = aiInsightsStr;

      // Parse insights into array
      const insightLines = aiInsights
        .split('\n')
        .filter((line: string) => line.trim().length > 0)
        .filter((line: string) => !line.includes('Financial Health') && !line.includes('Analysis:'));
      
      // Extract the top 3 most meaningful insights
      const meaningfulInsights = insightLines
        .filter((line: string) => line.length > 50)
        .slice(0, 3);

      if (isMounted) {
        setInsights(meaningfulInsights);
        setChartData(financialData);
      }

      // Generate detailed insights
      const detailedData: DetailedInsights = {
        ratios: {
          revenue_growth: 0.15,
          profit_margin: financialData.net_income / financialData.annual_revenue,
          current_ratio: financialData.cash_on_hand / financialData.total_liabilities,
          debt_to_equity: financialData.total_liabilities / (financialData.total_assets - financialData.total_liabilities),
          roa: financialData.net_income / financialData.total_assets,
          roe: financialData.net_income / (financialData.total_assets - financialData.total_liabilities)
        },
        trends: [
          'Revenue shows strong quarterly growth pattern',
          'Operating expenses remain well-controlled relative to revenue',
          'Cash flow management appears healthy with good working capital'
        ],
        recommendations: [
          'Consider reinvesting profit into growth opportunities',
          'Monitor accounts receivable aging to optimize cash flow',
          'Evaluate opportunities to improve operational efficiency'
        ],
        risks: [
          'High dependency on current revenue streams',
          'Monitor debt levels as company grows',
          'Ensure sufficient cash reserves for unexpected expenses'
        ]
      };
      setDetailedInsights(detailedData);

    } catch (error) {
      console.error('Error parsing stored data:', error);
      if (isMounted) {
        router.push('/');
      }
      return;
    }

    if (isMounted) {
      setIsLoading(false);
    }

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures this runs only once

  const handleNewAnalysis = () => {
    // Clear stored data and go back to home
    sessionStorage.removeItem('financialData');
    sessionStorage.removeItem('aiInsights');
    router.push('/');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial analysis...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Financial Analysis Results</h1>
              <p className="text-blue-100 text-lg">Comprehensive insights and recommendations for your business</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    const { jsPDF } = await import('jspdf');
                    const html2canvas = (await import('html2canvas')).default;
                    const el = pdfRef.current;
                    if (!el) return;
                    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const pageHeight = pdf.internal.pageSize.getHeight();
                    const imgWidth = pageWidth - 40; // 20pt margins
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    let y = 20;
                    // Title
                    pdf.setFont('helvetica', 'bold');
                    pdf.setFontSize(16);
                    pdf.text('Financial Insight - Analysis Report', 20, y);
                    y += 10;
                    // Image content, paginate if too tall
                    let remainingHeight = imgHeight;
                    let position = 40;
                    let imgY = position;
                    while (remainingHeight > 0) {
                      pdf.addImage(imgData, 'PNG', 20, imgY, imgWidth, Math.min(remainingHeight, pageHeight - position - 20));
                      remainingHeight -= (pageHeight - position - 20);
                      if (remainingHeight > 0) {
                        pdf.addPage();
                        imgY = 20;
                      }
                    }
                    pdf.save('financial_analysis.pdf');
                  }}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
                >
                  Export PDF
                </button>
                <button
                  onClick={handleNewAnalysis}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>New Analysis</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={pdfRef} className="container mx-auto px-4 py-8 bg-white">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex justify-center">
            <nav className="flex flex-wrap justify-center gap-4 bg-white rounded-xl p-3 shadow-lg border border-gray-200">
              {[
                { key: 'overview', label: 'Overview & Analysis', icon: '📊', description: 'AI insights & charts' },
                { key: 'kpi', label: 'KPI Tracker', icon: '🎯', description: 'Track performance metrics' },
                { key: 'quarterly', label: 'Quarterly Breakdown', icon: '📈', description: 'Quarterly analysis' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex flex-col items-center px-6 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl mb-1">{tab.icon}</span>
                  <span className="text-sm font-semibold">{tab.label}</span>
                  <span className={`text-xs mt-1 ${
                    activeTab === tab.key ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {tab.description}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              {/* AI Insights - Expandable */}
              {insights.length > 0 && (
                <ExpandableInsights 
                  basicInsights={insights}
                  detailedInsights={detailedInsights || undefined}
                />
              )}

              {/* Enhanced Charts Section */}
              {chartData && (
                <div className="max-w-7xl mx-auto">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-100 p-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                      <svg className="w-7 h-7 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Advanced Financial Analytics
                    </h2>
                    <FinancialCharts data={chartData} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* KPI Tracker Tab */}
          {activeTab === 'kpi' && (
            <div className="animate-in slide-in-from-right-4 duration-500">
              <KPITracker />
            </div>
          )}

          {/* Quarterly Breakdown Tab */}
          {activeTab === 'quarterly' && (
            <div className="animate-in slide-in-from-right-4 duration-500">
              <QuarterlyBreakdown 
                initialData={chartData ? {
                  revenue: { 
                    q1: chartData.annual_revenue * 0.22, 
                    q2: chartData.annual_revenue * 0.24, 
                    q3: chartData.annual_revenue * 0.26, 
                    q4: chartData.annual_revenue * 0.28 
                  },
                  profit: { 
                    q1: chartData.net_income * 0.20, 
                    q2: chartData.net_income * 0.25, 
                    q3: chartData.net_income * 0.27, 
                    q4: chartData.net_income * 0.28 
                  },
                  expenses: { 
                    q1: chartData.operating_expenses * 0.23, 
                    q2: chartData.operating_expenses * 0.24, 
                    q3: chartData.operating_expenses * 0.26, 
                    q4: chartData.operating_expenses * 0.27 
                  }
                } : {
                  revenue: { q1: 250000, q2: 275000, q3: 290000, q4: 320000 },
                  profit: { q1: 45000, q2: 52000, q3: 58000, q4: 65000 },
                  expenses: { q1: 180000, q2: 195000, q3: 205000, q4: 220000 }
                }}
              />
            </div>
          )}
        </div>

        {/* Footer with Summary Stats */}
        {chartData && (
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Key Financial Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">${chartData.annual_revenue.toLocaleString()}</div>
                <div className="text-sm text-green-700">Annual Revenue</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">${chartData.net_income.toLocaleString()}</div>
                <div className="text-sm text-blue-700">Net Income</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">${chartData.total_assets.toLocaleString()}</div>
                <div className="text-sm text-purple-700">Total Assets</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{chartData.number_of_employees}</div>
                <div className="text-sm text-orange-700">Employees</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
