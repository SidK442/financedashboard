"use client";
import { useState } from 'react';

type Props = {
  onParsedAction: (data: Record<string, number>) => void;
};

export default function CsvUpload({ onParsedAction }: Props) {
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const text = await file.text();
      // Simple CSV: header,row
      const [headerLine, dataLine] = text.trim().split(/\r?\n/);
      const headers = headerLine.split(',').map(h => h.trim());
      const values = dataLine.split(',').map(v => Number(v.trim()));
      const obj: Record<string, number> = {};
  headers.forEach((h, i) => { obj[h] = values[i]; });
  onParsedAction(obj);
    } catch (err: any) {
      setError('Failed to parse CSV. Please use the provided template.');
    }
  };

  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-semibold">Import from CSV</h3>
          <p className="text-sm text-gray-600">Headers (one row): annual_revenue,annual_recurring_revenue,gross_profit,operating_expenses,net_income,cash_on_hand,total_assets,total_liabilities,number_of_employees</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="file" accept=".csv" onChange={handleFile} />
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 text-sm underline"
            onClick={() => {
              const headers = [
                'annual_revenue',
                'annual_recurring_revenue',
                'gross_profit',
                'operating_expenses',
                'net_income',
                'cash_on_hand',
                'total_assets',
                'total_liabilities',
                'number_of_employees',
              ];
              const sample = ['1000000','800000','600000','300000','150000','250000','400000','300000','25'];
              const csv = headers.join(',') + '\n' + sample.join(',');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'financial_template.csv';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            Download template
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
