'use client';

import { useState, useEffect } from 'react';
import { KPI } from '@/types/financial';

interface KPITrackerProps {
  className?: string;
}

export default function KPITracker({ className = '' }: KPITrackerProps) {
  const [kpis, setKpis] = useState<KPI[]>([
    {
      id: '1',
      name: 'Monthly Revenue',
      value: 0,
      target: 100000,
      unit: '$',
      category: 'revenue'
    },
    {
      id: '2',
      name: 'Profit Margin',
      value: 0,
      target: 15,
      unit: '%',
      category: 'profitability'
    },
    {
      id: '3',
      name: 'Customer Growth',
      value: 0,
      target: 20,
      unit: '%',
      category: 'growth'
    },
    {
      id: '4',
      name: 'Cost Reduction',
      value: 0,
      target: 10,
      unit: '%',
      category: 'efficiency'
    }
  ]);

  const [editingKPI, setEditingKPI] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKPI, setNewKPI] = useState<Omit<KPI, 'id'>>({
    name: '',
    value: 0,
    target: 0,
    unit: '$',
    category: 'revenue'
  });

  const updateKPIValue = (id: string, newValue: number) => {
    setKpis(prev => prev.map(kpi => 
      kpi.id === id ? { ...kpi, value: newValue } : kpi
    ));
    setEditingKPI(null);
  };

  const addNewKPI = () => {
    if (newKPI.name.trim()) {
      const kpi: KPI = {
        ...newKPI,
        id: Date.now().toString()
      };
      setKpis(prev => [...prev, kpi]);
      setNewKPI({
        name: '',
        value: 0,
        target: 0,
        unit: '$',
        category: 'revenue'
      });
      setShowAddForm(false);
    }
  };

  const deleteKPI = (id: string) => {
    setKpis(prev => prev.filter(kpi => kpi.id !== id));
  };

  const calculateProgress = (value: number, target: number) => {
    return Math.min((value / target) * 100, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-yellow-500';
    if (progress >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getCategoryColor = (category: KPI['category']) => {
    switch (category) {
      case 'revenue': return 'border-green-200 bg-green-50';
      case 'growth': return 'border-blue-200 bg-blue-50';
      case 'efficiency': return 'border-purple-200 bg-purple-50';
      case 'profitability': return 'border-orange-200 bg-orange-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getCategoryIcon = (category: KPI['category']) => {
    switch (category) {
      case 'revenue':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      case 'growth':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'efficiency':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'profitability':
        return (
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l6-1v10M9 19c0 1.1-1.1 2-2.5 2S4 20.1 4 19s1.1-2 2.5-2 2.5.9 2.5 2zm0 0V9M15 15c0 1.1-1.1 2-2.5 2s-2.5-.9-2.5-2 1.1-2 2.5-2 2.5.9 2.5 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`max-w-6xl mx-auto px-4 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
            <svg className="w-6 h-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            KPI Tracker
          </h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Add KPI
          </button>
        </div>

        {/* Add New KPI Form */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New KPI</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">KPI Name</label>
                <input
                  type="text"
                  value={newKPI.name}
                  onChange={(e) => setNewKPI(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Monthly Sales"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Value</label>
                <input
                  type="number"
                  value={newKPI.target}
                  onChange={(e) => setNewKPI(prev => ({ ...prev, target: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Target"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <select
                  value={newKPI.unit}
                  onChange={(e) => setNewKPI(prev => ({ ...prev, unit: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="$">$ (Currency)</option>
                  <option value="%">% (Percentage)</option>
                  <option value="#"># (Number)</option>
                  <option value="hrs">hrs (Hours)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newKPI.category}
                  onChange={(e) => setNewKPI(prev => ({ ...prev, category: e.target.value as KPI['category'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="revenue">Revenue</option>
                  <option value="growth">Growth</option>
                  <option value="efficiency">Efficiency</option>
                  <option value="profitability">Profitability</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={addNewKPI}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Add KPI
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {kpis.map((kpi) => {
            const progress = calculateProgress(kpi.value, kpi.target);
            
            return (
              <div key={kpi.id} className={`relative p-6 rounded-lg border-2 ${getCategoryColor(kpi.category)} hover:shadow-lg transition-shadow duration-200`}>
                {/* Delete Button */}
                <button
                  onClick={() => deleteKPI(kpi.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-600 opacity-0 hover:opacity-100 transition-opacity duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Category Icon */}
                <div className="flex items-center mb-3">
                  {getCategoryIcon(kpi.category)}
                  <span className="ml-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {kpi.category}
                  </span>
                </div>

                {/* KPI Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{kpi.name}</h3>

                {/* Current Value */}
                <div className="mb-4">
                  {editingKPI === kpi.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        defaultValue={kpi.value}
                        onBlur={(e) => updateKPIValue(kpi.id, Number(e.target.value))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateKPIValue(kpi.id, Number((e.target as HTMLInputElement).value));
                          }
                        }}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        autoFocus
                      />
                      <span className="text-sm text-gray-600">{kpi.unit}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingKPI(kpi.id)}
                      className="text-left hover:bg-white hover:shadow-sm rounded px-2 py-1 transition-all duration-200"
                    >
                      <span className="text-2xl font-bold text-gray-900">
                        {kpi.unit === '$' ? `$${kpi.value.toLocaleString()}` : `${kpi.value}${kpi.unit}`}
                      </span>
                      <div className="text-sm text-gray-600">
                        Target: {kpi.unit === '$' ? `$${kpi.target.toLocaleString()}` : `${kpi.target}${kpi.unit}`}
                      </div>
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className={`text-xs font-medium px-2 py-1 rounded-full text-center ${
                  progress >= 90 ? 'bg-green-100 text-green-800' :
                  progress >= 70 ? 'bg-yellow-100 text-yellow-800' :
                  progress >= 50 ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {progress >= 90 ? 'Excellent' :
                   progress >= 70 ? 'Good' :
                   progress >= 50 ? 'Fair' : 'Needs Attention'}
                </div>
              </div>
            );
          })}
        </div>

        {kpis.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>No KPIs added yet. Click &quot;Add KPI&quot; to start tracking your key performance indicators.</p>
          </div>
        )}
      </div>
    </div>
  );
}
