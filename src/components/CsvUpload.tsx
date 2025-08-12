"use client";
import { useMemo, useState } from 'react';

type Props = {
  onParsedAction: (data: Record<string, number>) => void;
};

export default function CsvUpload({ onParsedAction }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPaste, setShowPaste] = useState(false);
  const [pasteValue, setPasteValue] = useState('');
  const [applied, setApplied] = useState(false);

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
  const headerLine = headers.join(',');
  const badges = useMemo(() => ({
    base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    ok: 'bg-green-50 text-green-700 border border-green-200',
    err: 'bg-red-50 text-red-700 border border-red-200'
  }), []);

  function parseNumber(value: string): number {
    const cleaned = value.replace(/[$,\s]/g, '');
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : NaN;
  }

  function parseCsvText(text: string): { data?: Record<string, number>, missing?: string[], extra?: string[] } {
    const lines = text
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0);
    if (lines.length < 2) {
      return {};
    }
    const header = lines[0].split(',').map(h => h.trim());
    const row = lines[1].split(',').map(v => v.trim());
    const data: Record<string, number> = {};
    header.forEach((h, i) => {
      data[h] = parseNumber(row[i] ?? '');
    });
    const requiredSet = new Set(headers);
    const headerSet = new Set(header);
    const missing = headers.filter(h => !headerSet.has(h));
    const extra = header.filter(h => !requiredSet.has(h));
    return { data, missing, extra };
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const text = await file.text();
      const result = parseCsvText(text);
      if (!result.data) throw new Error('Invalid CSV');
      if (result.missing && result.missing.length > 0) {
        setError(`Missing headers: ${result.missing.join(', ')}`);
        setApplied(false);
        setFileName(file.name);
        return;
      }
      onParsedAction(result.data);
      setApplied(true);
      setFileName(file.name);
    } catch (err: unknown) {
      setError('Failed to parse CSV. Please use the provided template.');
    }
  };

  const handleDrop = async (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    setIsDragging(false);
    const file = ev.dataTransfer.files?.[0];
    if (!file) return;
    const text = await file.text();
    const result = parseCsvText(text);
    if (!result.data) {
      setError('Invalid CSV');
      setApplied(false);
      return;
    }
    if (result.missing && result.missing.length > 0) {
      setError(`Missing headers: ${result.missing.join(', ')}`);
      setApplied(false);
      setFileName(file.name);
      return;
    }
    onParsedAction(result.data);
    setApplied(true);
    setFileName(file.name);
  };

  const handlePasteApply = () => {
    setError(null);
    const csv = `${headerLine}\n${pasteValue.trim()}`;
    const result = parseCsvText(csv);
    if (!result.data) {
      setError('Invalid pasted values; please use comma-separated numbers');
      setApplied(false);
      return;
    }
    onParsedAction(result.data);
    setApplied(true);
  };

  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">Import from CSV</h3>
          <p className="text-sm text-gray-600 mt-1">Headers (one row):</p>
          <div className="mt-2 bg-gray-50 border border-gray-200 rounded-md p-3 overflow-x-auto">
            <code className="text-xs font-mono text-gray-800 whitespace-pre">{headerLine}</code>
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            <button
              type="button"
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
              onClick={() => {
                if (navigator?.clipboard?.writeText) {
                  navigator.clipboard.writeText(headerLine).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }).catch(() => {/* noop */});
                }
              }}
            >
              Copy headers
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-white text-blue-700 hover:bg-blue-50 border border-blue-200"
              onClick={() => {
                const sample = ['1000000','800000','600000','300000','150000','250000','400000','300000','25'];
                const csv = headerLine + '\\n' + sample.join(',');
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
            <button
              type="button"
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              onClick={() => setShowPaste(v => !v)}
            >
              {showPaste ? 'Hide paste' : 'Paste row'}
            </button>
            {copied && <span className={`${badges.base} ${badges.ok}`}>Copied</span>}
          </div>
          {showPaste && (
            <div className="mt-3">
              <label className="block text-xs text-gray-600 mb-1">Paste values (comma-separated, in the same order as headers)</label>
              <textarea
                className="w-full rounded-md border border-gray-300 text-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="e.g. 1000000,800000,600000,300000,150000,250000,400000,300000,25"
                value={pasteValue}
                onChange={(e) => setPasteValue(e.target.value)}
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handlePasteApply}
                >
                  Apply to form
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                  onClick={() => setPasteValue('')}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="shrink-0 w-full md:w-auto">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`rounded-md border-2 ${isDragging ? 'border-blue-500' : 'border-dashed border-gray-300'} bg-white p-3 text-center`}
          >
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              <span>Choose CSV</span>
              <input className="hidden" type="file" accept=".csv" onChange={handleFile} />
            </label>
            <p className="text-xs text-gray-500 mt-2">or drag and drop a CSV here</p>
          </div>
          {fileName && (
            <p className="text-xs text-gray-500 mt-1 truncate max-w-[220px]" title={fileName}>Selected: {fileName}</p>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 items-center">
        {applied && <span className={`${badges.base} ${badges.ok}`}>Applied to form</span>}
        {error && <span className={`${badges.base} ${badges.err}`}>{error}</span>}
      </div>
    </div>
  );
}
