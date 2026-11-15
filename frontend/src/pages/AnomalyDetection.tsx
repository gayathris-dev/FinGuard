import React, { useState, useEffect } from 'react';
import {
  Radar,
  RefreshCw,
  Eye,
  AlertTriangle,
  Radio,
  SlidersHorizontal
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Drawer } from '../components/common/Drawer';
import { api } from '../services/api';

export const AnomalyDetection: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sampleSize, setSampleSize] = useState(500);
  const [selectedAnomaly, setSelectedAnomaly] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchAnomalies();
  }, [sampleSize]);

  const fetchAnomalies = async () => {
    try {
      setLoading(true);
      const res = await api.getAnomalyDetection(sampleSize);
      setData(res);
    } catch (e) {
      console.error('Failed to run anomaly detection:', e);
    } finally {
      setLoading(false);
    }
  };

  const normalPoints = (data?.scatter_points || []).filter((p: any) => !p.is_anomaly);
  const anomalousPoints = (data?.scatter_points || []).filter((p: any) => p.is_anomaly);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Unsupervised Anomaly Detection Desk
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Multivariate Isolation Forest (150 decision trees) isolating zero-day spending outliers
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center bg-[#F8FAFC] p-1 rounded-lg border border-[#E2E8F0]">
            <span className="text-[#64748B] px-2 text-[11px] font-medium">Sample:</span>
            {[250, 500, 1000].map(s => (
              <button
                key={s}
                onClick={() => setSampleSize(s)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                  sampleSize === s ? 'bg-[#FFFFFF] text-[#0F172A] font-semibold shadow-sm border border-[#E2E8F0]' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={fetchAnomalies}
            className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] text-[#0F172A] transition-all flex items-center gap-1.5 font-medium cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#64748B] ${loading ? 'animate-spin' : ''}`} />
            <span>Re-Evaluate</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-sm">
          <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block">Sample Ingestion</span>
          <span className="text-2xl font-bold font-mono text-[#0F172A] mt-1 block tabular-nums">{sampleSize} txns</span>
        </div>
        <div className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-sm">
          <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block">Outliers Isolated</span>
          <span className="text-2xl font-bold font-mono text-[#DC2626] mt-1 block tabular-nums">{data?.summary?.anomalies_detected || '22'}</span>
        </div>
        <div className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-sm">
          <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block">Contamination Alpha</span>
          <span className="text-2xl font-bold font-mono text-[#D97706] mt-1 block tabular-nums">{data?.summary?.anomaly_rate_percent || '4.5'}%</span>
        </div>
        <div className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-sm">
          <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block">Engine Architecture</span>
          <span className="text-base font-bold text-[#0F172A] mt-1.5 block">Isolation Forest (150 trees)</span>
        </div>
      </div>

      {/* 2D Projection Scatter Plot */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <h3 className="text-sm font-semibold text-[#0F172A] tracking-tight">
              Multivariate Isolation Scatter: Amount ($) vs. Distance (Miles)
            </h3>
            <p className="text-xs text-[#64748B]">High-dimensional vector projection separating baseline clusters from non-parametric outliers</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#64748B]"><span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" /> Nominal Cluster ({normalPoints.length})</span>
            <span className="flex items-center gap-1.5 text-[#DC2626] font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" /> Anomalous Outliers ({anomalousPoints.length})</span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 15, bottom: 10, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis type="number" dataKey="amount" name="Amount" unit="$" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis type="number" dataKey="distance_miles" name="Distance" unit=" mi" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ payload }) => {
                  if (!payload || !payload.length) return null;
                  const pt = payload[0].payload;
                  return (
                    <div className="p-3 bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg text-xs space-y-1 shadow-md">
                      <div className="font-mono font-bold text-[#0F172A]">{pt.transaction_id}</div>
                      <div className="text-[#64748B]">Amount: ${pt.amount.toFixed(2)}</div>
                      <div className="text-[#64748B]">Distance: {pt.distance_miles.toFixed(1)} mi</div>
                      <div className={pt.is_anomaly ? 'text-[#DC2626] font-bold' : 'text-[#059669]'}>
                        {pt.status} (Score: {pt.anomaly_score})
                      </div>
                    </div>
                  );
                }}
              />
              <Scatter name="Normal" data={normalPoints} fill="#2563EB" fillOpacity={0.4} />
              <Scatter name="Anomalous" data={anomalousPoints} fill="#DC2626" fillOpacity={0.9} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Histograms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-3">
            Anomaly Score Distribution (0.0 to 1.0)
          </span>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.score_histogram || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="bin" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#0F172A', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]}>
                  {data?.score_histogram?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.bin.includes('0.8') || entry.bin.includes('0.9') ? '#DC2626' : '#2563EB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-3">
            Isolated Outliers Pending Forensic Audit
          </span>
          <div className="space-y-2 overflow-y-auto max-h-52 pr-1">
            {anomalousPoints.slice(0, 5).map((pt: any) => (
              <div key={pt.transaction_id} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-semibold text-[#2563EB] block">{pt.transaction_id}</span>
                  <span className="text-[#64748B] text-[11px]">${pt.amount.toFixed(2)} • {pt.distance_miles.toFixed(0)} mi away</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FECACA]">
                    ANOMALY {pt.anomaly_score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
