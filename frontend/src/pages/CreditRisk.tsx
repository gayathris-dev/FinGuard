import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Sparkles,
  RefreshCw,
  Info,
  Shield,
  CheckCircle2,
  TrendingDown,
  UserCheck
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
import type { CreditPredictionResult } from '../types';

export const CreditRisk: React.FC = () => {
  const [formData, setFormData] = useState({
    applicant_id: 'APP-729402',
    age: 38,
    annual_income: 82000,
    employment_status: 'Full-Time Corporate',
    employment_duration_years: 6.5,
    loan_amount: 32000,
    loan_duration_months: 36,
    loan_purpose: 'Debt Consolidation',
    home_ownership: 'MORTGAGE',
    credit_score: 720,
    debt_to_income: 0.28,
    existing_debt: 22960,
    previous_defaults: 0,
    payment_history_score: 91.0
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<CreditPredictionResult | null>(null);
  const [visualMetrics, setVisualMetrics] = useState<any>(null);

  useEffect(() => {
    handlePredict();
    api.getCreditMetrics().then(setVisualMetrics).catch(console.error);
  }, []);

  const handlePredict = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      const res = await api.predictCredit(formData);
      setPrediction(res);
    } catch (err) {
      console.error('Credit prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Credit Risk & Underwriting Intelligence
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Machine learning default probability scoring with fair-lending advisory checks
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#2563EB] font-medium">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Fair Lending Advisory Model — Supervisory Oversight</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Borrower Form */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <span className="font-semibold text-[#0F172A] text-xs uppercase tracking-wider">Applicant Financial Profile</span>
            <span className="text-[10px] text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded font-mono font-medium">CREDIT FILE</span>
          </div>

          <form onSubmit={handlePredict} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">Applicant ID</label>
                <input
                  type="text"
                  value={formData.applicant_id}
                  onChange={(e) => setFormData({ ...formData, applicant_id: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] font-mono text-xs focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">Age</label>
                <input
                  type="number"
                  min="18"
                  max="95"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 18 })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] font-mono text-xs focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">Annual Income ($)</label>
                <input
                  type="number"
                  step="500"
                  value={formData.annual_income}
                  onChange={(e) => setFormData({ ...formData, annual_income: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] font-mono font-bold text-xs focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">FICO Bureau Score</label>
                <input
                  type="number"
                  min="300"
                  max="850"
                  value={formData.credit_score}
                  onChange={(e) => setFormData({ ...formData, credit_score: parseInt(e.target.value) || 300 })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] font-mono font-bold text-xs focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">Requested Loan ($)</label>
                <input
                  type="number"
                  step="1000"
                  value={formData.loan_amount}
                  onChange={(e) => setFormData({ ...formData, loan_amount: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] font-mono font-bold text-xs focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">Duration</label>
                <select
                  value={formData.loan_duration_months}
                  onChange={(e) => setFormData({ ...formData, loan_duration_months: parseInt(e.target.value) || 36 })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] text-xs focus:outline-none transition-colors"
                >
                  <option value={12}>12 Months</option>
                  <option value={24}>24 Months</option>
                  <option value={36}>36 Months</option>
                  <option value={48}>48 Months</option>
                  <option value={60}>60 Months</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">DTI Ratio</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.debt_to_income}
                  onChange={(e) => setFormData({ ...formData, debt_to_income: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] font-mono text-xs focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">Prior Defaults</label>
                <input
                  type="number"
                  min="0"
                  value={formData.previous_defaults}
                  onChange={(e) => setFormData({ ...formData, previous_defaults: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] font-mono text-xs focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">Pay Score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.payment_history_score}
                  onChange={(e) => setFormData({ ...formData, payment_history_score: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] font-mono text-xs focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Score Solvency & Default Hazard</span>
            </button>
          </form>
        </div>

        {/* Prediction Results */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-4 shadow-sm">
          {prediction ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider">Tier Rating:</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] font-mono">
                      {prediction.credit_rating}
                    </span>
                  </div>
                  <div className="text-3xl font-bold font-mono text-[#0F172A] tabular-nums">
                    {prediction.risk_score} <span className="text-xs font-normal text-[#64748B]">/ 100 Hazard Score</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-right">
                    <span className="text-[10px] text-[#64748B] block uppercase font-semibold tracking-wider">Default Hazard</span>
                    <span className={`text-base font-bold font-mono tabular-nums ${
                      prediction.default_probability > 0.4 ? 'text-[#DC2626]' : prediction.default_probability > 0.2 ? 'text-[#D97706]' : 'text-[#059669]'
                    }`}>
                      {(prediction.default_probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-right">
                    <span className="text-[10px] text-[#64748B] block uppercase font-semibold tracking-wider">Risk Band</span>
                    <RiskBadge level={prediction.risk_category} size="xs" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block mb-1">Solvency Assessment</span>
                <p className="text-xs text-[#0F172A] leading-relaxed font-medium">{prediction.creditworthiness_assessment}</p>
              </div>

              <div>
                <span className="text-xs text-[#475569] uppercase font-semibold tracking-wider block mb-2.5">
                  Primary Solvency Drivers
                </span>
                <div className="space-y-2 text-xs">
                  {prediction.main_contributing_factors.map((factor, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex justify-between items-center">
                      <span className="text-[#0F172A] font-medium text-xs">{factor.factor}</span>
                      <span className="text-[#64748B] text-[11px]">{factor.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-[#475569] uppercase font-semibold tracking-wider block mb-2">
                  Underwriting Risk Mitigation Protocols
                </span>
                <div className="space-y-2 text-xs text-[#475569]">
                  {prediction.suggested_risk_mitigation.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                      <span className="text-xs text-[#0F172A]">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Visualizations Row */}
      {visualMetrics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0F172A] block mb-3">
              Default Probability by Income Bracket
            </span>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visualMetrics.income_metrics || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="bracket" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit="%" />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#0F172A', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="avg_default_prob" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0F172A] block mb-3">
              Default Risk by Employment Category
            </span>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visualMetrics.employment_metrics || []} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                  <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} unit="%" />
                  <YAxis dataKey="employment" type="category" stroke="#475569" fontSize={10} tickLine={false} width={100} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#0F172A', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="default_prob" fill="#D97706" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-3 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0F172A] block">
              Portfolio Credit Stratification
            </span>
            <div className="space-y-3 pt-1 text-xs">
              {visualMetrics.risk_distribution?.map((item: any) => (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[#475569] font-medium">{item.category}</span>
                    <span className="text-[#0F172A] font-mono font-semibold tabular-nums">{item.count}</span>
                  </div>
                  <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(item.count / 5000) * 100}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
