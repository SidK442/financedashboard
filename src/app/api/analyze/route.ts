import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    console.log('Received data:', data);

    // Try to store data in Supabase with better error handling
    try {
      console.log('Attempting to save to Supabase...');
      const { error } = await supabase
        .from('financial_data')
        .insert([data]);

      if (error) {
        console.error('Supabase error:', error);
        // Continue with analysis even if storage fails
      } else {
        console.log('Data successfully saved to Supabase');
      }
    } catch (supabaseError) {
      console.error('Supabase connection error:', supabaseError);
      // Continue with analysis
    }

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    console.log('Starting OpenAI analysis...');

    // Calculate key financial ratios
    const grossProfitMargin = ((data.gross_profit / data.annual_revenue) * 100).toFixed(1);
    const netProfitMargin = ((data.net_income / data.annual_revenue) * 100).toFixed(1);
    const debtToAssetRatio = ((data.total_liabilities / data.total_assets) * 100).toFixed(1);
    const assetTurnover = (data.annual_revenue / data.total_assets).toFixed(2);
    const cashRatio = ((data.cash_on_hand / data.total_liabilities) * 100).toFixed(1);

    const prompt = `As a financial analyst, analyze this company's financial data and provide exactly 3 key insights:

Financial Data:
• Annual Revenue: $${data.annual_revenue.toLocaleString()}
• Annual Recurring Revenue: $${data.annual_recurring_revenue.toLocaleString()}
• Gross Profit: $${data.gross_profit.toLocaleString()} (Margin: ${grossProfitMargin}%)
• Net Income: $${data.net_income.toLocaleString()} (Margin: ${netProfitMargin}%)
• Operating Expenses: $${data.operating_expenses.toLocaleString()}
• Total Assets: $${data.total_assets.toLocaleString()}
• Total Liabilities: $${data.total_liabilities.toLocaleString()}
• Cash on Hand: $${data.cash_on_hand.toLocaleString()}
• Debt-to-Asset Ratio: ${debtToAssetRatio}%
• Asset Turnover: ${assetTurnover}x
• Cash-to-Liabilities Ratio: ${cashRatio}%
• Number of Employees: ${data.number_of_employees}

Please provide exactly 3 distinct, actionable insights about this company's financial health. Each insight should be 1-2 sentences and focus on different aspects (profitability, liquidity, efficiency, etc.). Number them 1, 2, 3.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional financial analyst. Provide exactly 3 clear, actionable insights about the company's financial health. Each insight should be a complete sentence and focus on different aspects like profitability, liquidity, or operational efficiency."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 800,
    });

    const aiResponse = completion.choices[0].message.content || "Unable to generate insights at this time.";
    console.log('OpenAI response:', aiResponse);

    // Parse the response to extract exactly 3 insights
    const insights = aiResponse
      .split('\n')
      .filter(line => line.trim().length > 0)
      .filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 30 && // Filter out short headers
               !trimmed.toLowerCase().includes('financial health') &&
               !trimmed.toLowerCase().includes('analysis:') &&
               !trimmed.toLowerCase().includes('summary:');
      })
      .slice(0, 3); // Take exactly 3 insights

    console.log('Processed insights:', insights);

    return NextResponse.json({ 
      success: true, 
      insights: insights.length > 0 ? insights.join('\n') : aiResponse,
      ratios: {
        grossProfitMargin: `${grossProfitMargin}%`,
        netProfitMargin: `${netProfitMargin}%`,
        debtToAssetRatio: `${debtToAssetRatio}%`,
        assetTurnover: `${assetTurnover}x`,
        cashRatio: `${cashRatio}%`
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
