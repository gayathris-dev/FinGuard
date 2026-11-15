import React, { useState, useEffect } from 'react';
import {
  LineChart as LineChartIcon,
  Sparkles,
  Send,
  RefreshCw,
  Activity,
  TrendingUp,
  TrendingDown,
  Globe,
  ArrowRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { api } from '../services/api';
import type { NewsItem } from '../types';

export const MarketSentiment: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [customText, setCustomText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [customResult, setCustomResult] = useState<any>(null);
  const [selectedSector, setSelectedSector] = useState('all');

  useEffect(() => {
    fetchSentimentData();
  }, []);

  const fetchSentimentData = async () => {
    try {
      setLoading(true);
      const res = await api.getSentimentOverview();
      setOverview(res);
    } catch (e) {
      console.error('Failed to load sentiment data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    try {
      setAnalyzing(true);
      const res = await api.analyzeSentiment(customText);
      setCustomResult(res);
    } catch (e) {
      console.error('Custom sentiment analysis failed:', e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Financial News Sentiment & Transmission Matrix
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            NLP analysis of macroeconomic announcements, regulatory filings, and market sentiment
          </p>
        </div>

        <button
          onClick={fetchSentimentData}
          className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] text-[#0F172A] transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#64748B]" />
          <span>Sync Feed</span>
        </button>
      </div>

      {/* Top Sentiment Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Gauge card */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1">
              Composite Sentiment Index
            </span>
            <div className="text-center py-4">
              <div className="text-4xl font-bold font-mono text-[#0F172A] tracking-tight tabular-nums">
                {overview?.gauge_score !== undefined ? (overview.gauge_score > 0 ? `+${overview.gauge_score}` : overview.gauge_score) : '-14.2'}
              </div>
              <span className="text-xs text-[#D97706] font-semibold px-3 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] uppercase tracking-wider mt-2 inline-block">
                Bearish Contraction (-100 to +100)
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F1F5F9] space-y-2 text-xs">
            {overview?.distribution?.map((item: any) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-[#64748B]">{item.label}</span>
                <span className="text-[#0F172A] font-mono font-semibold">{item.percentage}% ({item.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rolling Area Chart */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-3">
            Daily NLP Sentiment Progression (-1.0 to +1.0)
          </span>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overview?.trend || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sentimentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis domain={[-1, 1]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#0F172A', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="sentiment_score" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#sentimentGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive NLP Analyzer */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-sm font-semibold text-[#0F172A]">
            Interactive Financial News Scorer (TF-IDF + ML Pipeline)
          </h3>
        </div>
        <form onSubmit={handleAnalyzeCustom} className="space-y-3">
          <textarea
            rows={2}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Type or paste financial headline: e.g. Major credit rating agency downgrades regional automotive loan pools..."
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg p-3 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none transition-colors"
          />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
            <div className="flex items-center gap-3 text-[#64748B]">
              <span className="text-[11px]">Quick samples:</span>
              <button type="button" onClick={() => setCustomText("Federal Reserve announces emergency liquidity window to stabilize regional banking reserves.")} className="hover:text-[#2563EB] text-[11px] underline">Fed Liquidity</button>
              <span>•</span>
              <button type="button" onClick={() => setCustomText("Subprime auto loan defaults surge to 15-year highs as debt-to-income limits fail.")} className="hover:text-[#2563EB] text-[11px] underline">Subprime Defaults</button>
            </div>
            <button
              type="submit"
              disabled={analyzing || !customText.trim()}
              className="px-4 py-2 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs uppercase tracking-wider disabled:opacity-50 transition-colors cursor-pointer shadow-sm"
            >
              {analyzing ? 'Evaluating...' : 'Score Headline'}
            </button>
          </div>
        </form>

        {customResult && (
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#2563EB] font-bold uppercase tracking-wider">
                Classification: {customResult.sentiment} ({customResult.sentiment_score})
              </span>
              <span className="text-[#64748B] font-mono">Confidence: {(customResult.confidence * 100).toFixed(1)}%</span>
            </div>
            <p className="text-xs text-[#0F172A] leading-relaxed">{customResult.market_impact_analysis}</p>
          </div>
        )}
      </div>

      {/* Sector Matrix */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-semibold text-[#0F172A]">
          Sector-wise Sentiment & Contagion Matrix
        </h3>
        <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[11px] uppercase tracking-wider text-[#475569] bg-[#F8FAFC]">
                <th className="py-3 pl-4 font-semibold">Sector</th>
                <th className="py-3 font-semibold">Articles Analyzed</th>
                <th className="py-3 font-semibold">Net Score</th>
                <th className="py-3 font-semibold">Market Stance</th>
                <th className="py-3 pr-4 text-right font-semibold">Risk Exposure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] bg-[#FFFFFF]">
              {overview?.sector_sentiment?.map((sec: any) => (
                <tr key={sec.sector} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 pl-4 font-semibold text-[#0F172A]">{sec.sector}</td>
                  <td className="py-3 font-mono text-[#475569]">{sec.article_count}</td>
                  <td className="py-3 font-mono font-bold">
                    <span className={sec.sentiment_score > 0 ? 'text-[#059669]' : 'text-[#DC2626]'}>
                      {sec.sentiment_score > 0 ? `+${sec.sentiment_score}` : sec.sentiment_score}
                    </span>
                  </td>
                  <td className="py-3 text-[#475569]">{sec.sentiment_label}</td>
                  <td className="py-3 pr-4 text-right">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${
                      sec.risk_status === 'High Risk' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]' : 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                    }`}>
                      {sec.risk_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
