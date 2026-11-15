import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Upload,
  Cpu,
  BarChart3,
  RefreshCw,
  Sparkles,
  Activity,
  FileSpreadsheet,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { RiskBadge } from '../components/common/RiskBadge';
import { api } from '../services/api';
import type { FraudPredictionResult } from '../types';

export const FraudDetection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'model'>('single');
  
  const [formData, setFormData] = useState({
    account_id: 'ACC-849201',
    amount: 3850.00,
    merchant_category: 'Crypto & Digital Assets',
    location: 'London, UK',
    distance_miles: 3450.0,
    is_foreign: 1,
    device_type: 'Web Browser (Chrome)',
    channel: 'E-Commerce Web',
    frequency_24h: 7,
    hour: 3,
    day_of_week: 2
  });

  const [predicting, setPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<FraudPredictionResult | null>(null);

  const [batchFile, setBatchFile] = useState<File | null>(null);
  const [batchUploading, setBatchUploading] = useState(false);
  const [batchResult, setBatchResult] = useState<any>(null);
  const [batchError, setBatchError] = useState<string | null>(null);

  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    handleSinglePredict();
    api.getFraudMetrics().then(setMetrics).catch(console.error);
  }, []);

  const handleSinglePredict = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setPredicting(true);
      const res = await api.predictFraud(formData);
      setPredictionResult(res);
    } catch (err) {
      console.error('Fraud prediction error:', err);
    } finally {
      setPredicting(false);
    }
  };

  const handleBatchUpload = async () => {
    if (!batchFile) return;
    try {
      setBatchUploading(true);
      setBatchError(null);
      const res = await api.uploadFraudBatch(batchFile);
      setBatchResult(res);
    } catch (err: any) {
      setBatchError(err?.message || 'Batch dataset processing failed');
    } finally {
      setBatchUploading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header and Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Fraud Detection & Scoring Engine
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Supervised Gradient Boosting classifier with calibrated probabilities and SHAP feature attribution
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-3 py-1.5 rounded-md transition-all font-medium ${
              activeTab === 'single' ? 'bg-[#FFFFFF] text-[#0F172A] font-semibold shadow-sm border border-[#E2E8F0]' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Real-time Inference
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-3 py-1.5 rounded-md transition-all font-medium ${
              activeTab === 'batch' ? 'bg-[#FFFFFF] text-[#0F172A] font-semibold shadow-sm border border-[#E2E8F0]' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Batch CSV Ingest
          </button>
          <button
            onClick={() => setActiveTab('model')}
            className={`px-3 py-1.5 rounded-md transition-all font-medium ${
              activeTab === 'model' ? 'bg-[#FFFFFF] text-[#0F172A] font-semibold shadow-sm border border-[#E2E8F0]' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Model Performance
          </button>
        </div>
      </div>

      {/* Tab 1: Single Inference */}
      {activeTab === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Input Form */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <span className="font-semibold text-[#0F172A] text-xs uppercase tracking-wider">Transaction Parameters</span>
              <span className="text-[10px] text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded font-mono font-medium">LIVE EVALUATION</span>
            </div>

            <form onSubmit={handleSinglePredict} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">Account ID</label>
                  <input
                    type="text"
                    value={formData.account_id}
                    onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] font-mono text-xs focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">Amount (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] font-mono font-bold text-xs focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">Merchant Category Code (MCC)</label>
                <select
                  value={formData.merchant_category}
                  onChange={(e) => setFormData({ ...formData, merchant_category: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] text-xs focus:outline-none transition-colors"
                >
                  <option value="Groceries & Food">Groceries & Food</option>
                  <option value="Retail & Shopping">Retail & Shopping</option>
                  <option value="Travel & Airlines">Travel & Airlines</option>
                  <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                  <option value="Crypto & Digital Assets">Crypto & Digital Assets (High Volatility)</option>
                  <option value="Wire Transfer / Remittance">Wire Transfer / Remittance</option>
                  <option value="Luxury Goods & Jewelry">Luxury Goods & Jewelry</option>
                  <option value="Online Gaming & Gambling">Online Gaming & Gambling</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">Origin Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] text-xs focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">Distance (Miles)</label>
                  <input
                    type="number"
                    value={formData.distance_miles}
                    onChange={(e) => setFormData({ ...formData, distance_miles: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] font-mono text-xs focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">Device Type</label>
                  <select
                    value={formData.device_type}
                    onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] text-xs focus:outline-none transition-colors"
                  >
                    <option value="Mobile App (iOS)">Mobile App (iOS)</option>
                    <option value="Mobile App (Android)">Mobile App (Android)</option>
                    <option value="Web Browser (Chrome)">Web Browser (Chrome)</option>
                    <option value="POS Terminal">POS Terminal</option>
                    <option value="ATM">ATM Terminal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">Clearing Channel</label>
                  <select
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] text-xs focus:outline-none transition-colors"
                  >
                    <option value="In-store Chip/NFC">In-store Chip/NFC</option>
                    <option value="E-Commerce Web">E-Commerce Web</option>
                    <option value="Mobile In-App">Mobile In-App</option>
                    <option value="P2P Transfer">P2P Transfer</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">24h Velocity</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.frequency_24h}
                    onChange={(e) => setFormData({ ...formData, frequency_24h: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] font-mono text-xs focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">Hour (0-23)</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={formData.hour}
                    onChange={(e) => setFormData({ ...formData, hour: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] font-mono text-xs focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">Foreign Node</label>
                  <select
                    value={formData.is_foreign}
                    onChange={(e) => setFormData({ ...formData, is_foreign: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-2 py-2 text-[#0F172A] text-xs focus:outline-none transition-colors"
                  >
                    <option value={0}>Domestic (0)</option>
                    <option value={1}>Foreign (1)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={predicting}
                className="w-full mt-3 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {predicting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Execute Gradient Boosting Inference</span>
              </button>
            </form>
          </div>

          {/* Inference Output */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-4 shadow-sm">
            {predictionResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider">Classification:</span>
                      <RiskBadge level={predictionResult.risk_classification} size="sm" />
                    </div>
                    <div className="text-3xl font-bold font-mono text-[#0F172A] tabular-nums">
                      {predictionResult.risk_score} <span className="text-xs font-normal text-[#64748B]">/ 100 Threat Score</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-right">
                      <span className="text-[10px] text-[#64748B] block uppercase font-semibold tracking-wider">Fraud Probability</span>
                      <span className="text-base font-bold font-mono text-[#DC2626] tabular-nums">
                        {(predictionResult.fraud_probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-right">
                      <span className="text-[10px] text-[#64748B] block uppercase font-semibold tracking-wider">Confidence</span>
                      <span className="text-base font-bold font-mono text-[#2563EB] tabular-nums">
                        {(predictionResult.prediction_confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block mb-1">Supervisory Protocol Recommendation</span>
                  <p className="text-xs text-[#0F172A] leading-relaxed font-medium">{predictionResult.recommended_action}</p>
                </div>

                <div>
                  <span className="text-xs text-[#475569] uppercase font-semibold tracking-wider block mb-2.5">
                    Feature Attribution Vectors (SHAP / Gini Breakdown)
                  </span>
                  <div className="space-y-2 text-xs">
                    {predictionResult.contributing_factors.map((factor, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${factor.impact === 'negative' ? 'bg-[#DC2626]' : 'bg-[#059669]'}`} />
                          <div>
                            <span className="text-[#0F172A] font-medium text-xs block">{factor.factor}</span>
                            <span className="text-[#64748B] text-[11px]">{factor.description}</span>
                          </div>
                        </div>
                        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                          factor.impact === 'negative' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]' : 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                        }`}>
                          {factor.impact === 'negative' ? '+' : '-'}{(factor.weight * 100).toFixed(0)} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex justify-between text-[11px] text-[#64748B] font-mono">
                  <span>Engine: {predictionResult.inference_mode}</span>
                  <span>Evaluated: {predictionResult.evaluated_at}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Tab 2: Batch CSV Ingest */}
      {activeTab === 'batch' && (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 space-y-5 shadow-sm">
          <div className="border-2 border-dashed border-[#CBD5E1] hover:border-[#2563EB] rounded-xl p-8 text-center bg-[#F8FAFC] transition-colors">
            <Upload className="w-10 h-10 mx-auto text-[#2563EB] mb-3" />
            <label className="cursor-pointer">
              <span className="text-sm font-semibold text-[#2563EB] hover:underline uppercase tracking-wider">
                Select CSV Dataset to Ingest & Score
              </span>
              <input type="file" accept=".csv" onChange={(e) => setBatchFile(e.target.files?.[0] || null)} className="hidden" />
            </label>
            <p className="text-xs text-[#64748B] mt-2">
              {batchFile ? `Selected: ${batchFile.name}` : 'Supports financial batches with account_id, amount, distance_miles, is_foreign, etc.'}
            </p>
          </div>

          {batchError && (
            <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-xs">
              {batchError}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleBatchUpload}
              disabled={!batchFile || batchUploading}
              className="px-5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs uppercase tracking-wider disabled:opacity-50 transition-colors cursor-pointer shadow-sm"
            >
              {batchUploading ? 'Processing Batch...' : 'Execute Batch Inference'}
            </button>
          </div>

          {batchResult && (
            <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
              <div className="grid grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                  <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block">Evaluated</span>
                  <span className="text-lg font-bold font-mono text-[#0F172A] mt-0.5 block">{batchResult.total_analyzed}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                  <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block">Flagged</span>
                  <span className="text-lg font-bold font-mono text-[#D97706] mt-0.5 block">{batchResult.flagged_count}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                  <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block">Critical</span>
                  <span className="text-lg font-bold font-mono text-[#DC2626] mt-0.5 block">{batchResult.critical_count}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                  <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block">Mean Risk Score</span>
                  <span className="text-lg font-bold font-mono text-[#2563EB] mt-0.5 block">{batchResult.average_risk_score}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Model Performance */}
      {activeTab === 'model' && metrics && (
        <div className="space-y-5">
          <div className="grid grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-sm">
              <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block">ROC-AUC Score</span>
              <span className="text-2xl font-bold font-mono text-[#059669] mt-1 block">{metrics.metrics.roc_auc}</span>
            </div>
            <div className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-sm">
              <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block">Precision</span>
              <span className="text-2xl font-bold font-mono text-[#2563EB] mt-1 block">{(metrics.metrics.precision * 100).toFixed(1)}%</span>
            </div>
            <div className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-sm">
              <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block">Recall</span>
              <span className="text-2xl font-bold font-mono text-[#D97706] mt-1 block">{(metrics.metrics.recall * 100).toFixed(1)}%</span>
            </div>
            <div className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-sm">
              <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block">F1-Score</span>
              <span className="text-2xl font-bold font-mono text-[#059669] mt-1 block">{metrics.metrics.f1_score}</span>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
            <span className="text-sm font-semibold text-[#0F172A] uppercase tracking-wide block mb-3">
              Gini Feature Split Importances
            </span>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={metrics.top_feature_importance} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                  <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis dataKey="feature" type="category" stroke="#475569" fontSize={11} tickLine={false} width={140} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#0F172A', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="importance" fill="#2563EB" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
