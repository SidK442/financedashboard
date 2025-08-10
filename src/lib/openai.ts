import OpenAI from 'openai';
import { FinancialData } from './supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateFinancialInsights(data: Omit<FinancialData, 'id' | 'created_at'>) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a financial analyst providing brief, actionable insights based on company financial metrics."
        },
        {
          role: "user",
          content: `Please analyze these financial metrics and provide 3-4 key insights and recommendations:
            Annual Revenue: ${data.annual_revenue}
            Gross Profit: ${data.gross_profit}
            Operating Expenses: ${data.operating_expenses}
            Net Income: ${data.net_income}
            Cash on Hand: ${data.cash_on_hand}
            Total Assets: ${data.total_assets}
            Total Liabilities: ${data.total_liabilities}
            Annual Recurring Revenue: ${data.annual_recurring_revenue}
            Number of Employees: ${data.number_of_employees}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating insights:', error);
    throw new Error('Failed to generate insights');
  }
}
