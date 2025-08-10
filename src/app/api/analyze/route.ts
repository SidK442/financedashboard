import { NextResponse } from 'next/server';

interface FinancialData {
  company_name: string;
  annual_revenue: number;
  gross_profit: number;
  net_income: number;
  total_assets: number;
  total_liabilities: number;
  cash_on_hand: number;
  number_of_employees: number;
}

interface FinancialRatios {
  grossProfitMargin: number;
  netProfitMargin: number;
  debtToAssetRatio: number;
  assetTurnover: number;
  cashRatio: number;
}

export async function POST(request: Request) {
  try {
    const data: FinancialData = await request.json();
    
    console.log('Received data:', data);
    console.log('Starting financial analysis...');

    // Calculate key financial ratios
    const grossProfitMargin = ((data.gross_profit / data.annual_revenue) * 100);
    const netProfitMargin = ((data.net_income / data.annual_revenue) * 100);
    const debtToAssetRatio = ((data.total_liabilities / data.total_assets) * 100);
    const assetTurnover = (data.annual_revenue / data.total_assets);
    const cashRatio = ((data.cash_on_hand / data.total_liabilities) * 100);

    // Generate intelligent insights based on financial ratios
    const insights = generateFinancialInsights(data, {
      grossProfitMargin,
      netProfitMargin,
      debtToAssetRatio,
      assetTurnover,
      cashRatio
    });

    return NextResponse.json({ 
      success: true, 
      insights: insights,
      ratios: {
        grossProfitMargin: `${grossProfitMargin.toFixed(1)}%`,
        netProfitMargin: `${netProfitMargin.toFixed(1)}%`,
        debtToAssetRatio: `${debtToAssetRatio.toFixed(1)}%`,
        assetTurnover: `${assetTurnover.toFixed(2)}x`,
        cashRatio: `${cashRatio.toFixed(1)}%`
      }
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}

function generateFinancialInsights(data: FinancialData, ratios: FinancialRatios): string {
  const insights: string[] = [];
  
  // Profitability insight
  if (ratios.netProfitMargin > 15) {
    insights.push(`1. Strong profitability with excellent cost management - your net profit margin of ${ratios.netProfitMargin.toFixed(1)}% indicates efficient operations and good pricing power.`);
  } else if (ratios.netProfitMargin > 5) {
    insights.push(`1. Moderate profitability with room for improvement - consider optimizing operational efficiency to increase your ${ratios.netProfitMargin.toFixed(1)}% net profit margin.`);
  } else {
    insights.push(`1. Profitability concerns require immediate attention - your ${ratios.netProfitMargin.toFixed(1)}% net profit margin suggests need for cost reduction or revenue enhancement strategies.`);
  }
  
  // Liquidity insight
  if (ratios.cashRatio > 50) {
    insights.push(`2. Excellent liquidity position provides strong financial flexibility - your cash-to-liabilities ratio of ${ratios.cashRatio.toFixed(1)}% ensures ability to meet short-term obligations.`);
  } else if (ratios.cashRatio > 20) {
    insights.push(`2. Adequate liquidity position but monitor cash flow closely - maintain your ${ratios.cashRatio.toFixed(1)}% cash-to-liabilities ratio while optimizing working capital.`);
  } else {
    insights.push(`2. Liquidity concerns may impact operations - your ${ratios.cashRatio.toFixed(1)}% cash-to-liabilities ratio suggests need for improved cash management strategies.`);
  }
  
  // Efficiency insight
  if (ratios.assetTurnover > 1.5) {
    insights.push(`3. High asset efficiency demonstrates effective resource utilization - your ${ratios.assetTurnover.toFixed(2)}x asset turnover shows strong revenue generation from assets.`);
  } else if (ratios.assetTurnover > 0.8) {
    insights.push(`3. Moderate asset efficiency with optimization opportunities - consider strategies to improve your ${ratios.assetTurnover.toFixed(2)}x asset turnover ratio.`);
  } else {
    insights.push(`3. Asset utilization requires improvement - your ${ratios.assetTurnover.toFixed(2)}x asset turnover suggests underutilized resources that could generate more revenue.`);
  }
  
  return insights.join('\n\n');
}
