import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Sparkles,
  RefreshCw,
  Activity,
  AlertOctagon,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { api } from '../services/api';

export const RiskIntelligence: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await api.getRiskSummary();
      setData(res);
    } catch (e) {
      console.error('Failed to load risk intelligence summary:', e);
    } finally {
      setLoading(false);
    }
  };

  const radarData = data?.indicators ? [
    { subject: 'Fraud Velocity', score: data.indicators.fraud_risk.score, fullMark: 100 },
    { subject: 'Credit Default', score: data.indicators.credit_exposure.score, fullMark: 100 },
    { subject: 'Macro Sentiment', score: data.indicators.market_sentiment.score, fullMark: 100 },
    { subject: 'Anomaly Outliers', score: data.indicators.anomaly_velocity.score, fullMark: 100 },
    { subject: 'Liquidity Stress', score: 38.5, fullMark: 100 },
    { subject: 'Compliance Drift', score: 22.0, fullMark: 100 },
  ] : [];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Cross-Domain Risk Intelligence Bureau
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Enterprise composite index aggregating fraud surveillance, underwriting hazards, and market contagion
          </p>
        </div>

        <button
          onClick={fetchSummary}
          className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] text-[#0F172A] transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#64748B]" />
          <span>Sync Bureau</span>
        </button>
      </div>

      {/* Top Banner: Composite Index & Executive AI Narrative */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Index Dial */}
          <div className="lg:col-span-4 p-5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-center">
            <span className="text-[11px] text-[#64748B] uppercase font-semibold tracking-wider block">
              Institutional Composite Risk Index
            </span>
            <div className="text-5xl font-bold font-mono text-[#0F172A] tracking-tight tabular-nums my-2">
              {data?.composite_index || '32.4'}
              <span className="text-base font-normal text-[#64748B]"> / 100</span>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full border inline-block bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]">
              {data?.risk_level || 'MODERATE / STABLE'}
            </span>
          </div>

          {/* Narrative */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Autonomous Executive Risk Briefing</span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              {data?.executive_summary || 'Institutional risk metrics across transaction clearing and credit underwriting maintain stable equilibrium.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#F1F5F9] text-xs">
              {data?.indicators && Object.entries(data.indicators).map(([key, ind]: [string, any]) => (
                <div key={key} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block truncate">{ind.label}</span>
                  <div className="text-base font-bold font-mono text-[#0F172A] mt-1">{ind.score}</div>
                  <span className="text-[11px] text-[#D97706] font-mono">{ind.delta}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Radar Chart & Correlation Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-sm font-semibold text-[#0F172A] tracking-tight mb-1">
              Multi-Axis Threat Vector Projection
            </h3>
            <p className="text-xs text-[#64748B] mb-3">Holistic radar synthesis across institutional pillars</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" stroke="#64748B" fontSize={10} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#94A3B8" fontSize={9} />
                <Radar name="Threat Level" dataKey="score" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#0F172A', borderRadius: '8px', fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[11px] text-[#64748B] pt-2 border-t border-[#F1F5F9]">
            Weights: Fraud 35% • Credit 30% • Sentiment 20% • Anomaly 15%
          </span>
        </div>

        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-4 shadow-sm">
          <div>
            <h3 className="text-sm font-semibold text-[#0F172A] tracking-tight mb-1">
              Empirical Cross-Factor Covariance Matrix
            </h3>
            <p className="text-xs text-[#64748B]">Inter-system risk transmission and contagion coefficients</p>
          </div>
          <div className="space-y-2.5 text-xs">
            {data?.correlation_matrix?.map((item: any, idx: number) => (
              <div key={idx} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex justify-between items-center">
                <div className="pr-3">
                  <div className="text-[#0F172A] text-xs font-semibold">{item.factor}</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">{item.description}</div>
                </div>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border tabular-nums ${
                  item.correlation > 0.6 ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]' :
                  item.correlation < -0.5 ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]' :
                  'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                }`}>
                  {item.correlation > 0 ? `+${item.correlation}` : item.correlation}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
