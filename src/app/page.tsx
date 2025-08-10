'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FinancialForm from '@/components/FinancialForm';
import PasswordProtection from '@/components/PasswordProtection';
import { FinancialData } from '@/lib/supabase';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: Omit<FinancialData, 'id' | 'created_at'>) => {
    setIsAnalyzing(true);
    
    try {
      console.log('Processing financial data...');
      
      // Get AI analysis with Supabase storage
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to get AI analysis');
      }

      const { insights: aiInsights } = await response.json();
      console.log('Received insights:', aiInsights);
      
      // Store data in sessionStorage for the results page
      sessionStorage.setItem('financialData', JSON.stringify(data));
      sessionStorage.setItem('aiInsights', aiInsights);
      
      // Redirect to results page
      router.push('/results');
      
    } catch (error) {
      console.error('Error processing data:', error);
      alert(`Failed to process data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Show password protection first
  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <main className="min-h-screen bg-gray-50 relative">
      <div className="container mx-auto py-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Financial Insight
          </h1>
        </div>
        
        {/* Features Section - Now at Top */}
        <div className="max-w-4xl mx-auto px-4 mb-12">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Ready to Analyze Your Financial Data?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">AI Analysis</h3>
                    <p className="text-sm text-gray-600">Get intelligent insights and recommendations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Visual Charts</h3>
                    <p className="text-sm text-gray-600">Interactive charts and financial visualizations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">KPI Tracking</h3>
                    <p className="text-sm text-gray-600">Monitor key performance indicators</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section - Subtitle */}
        <div className="text-center mb-8">
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter your company&apos;s financial data to receive comprehensive analysis, visual insights and AI-powered recommendations
          </p>
        </div>
        
        {/* Form Section - Now Below Features */}
        <FinancialForm onSubmitAction={handleSubmit} />
        
        {/* Loading State */}
        {isAnalyzing && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-8 py-4 bg-white rounded-lg shadow-lg border border-gray-200">
              <svg className="animate-spin -ml-1 mr-4 h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-medium text-gray-700">
                Analyzing your financial data with AI...
              </span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
