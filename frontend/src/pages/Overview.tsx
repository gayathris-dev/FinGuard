import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  ShieldAlert,
  Percent,
  Users,
  Gauge,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Eye,
  Search,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';
import { MetricCard } from '../components/common/MetricCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { Drawer } from '../components/common/Drawer';
import { api } from '../services/api';
import type { Transaction } from '../types';

export const Overview: React.FC<{ onNavigateToModule?: (tab: string) => void }> = ({ onNavigateToModule }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activityTimeframe, setActivityTimeframe] = useState<'daily' | 'weekly'>('daily');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tableSearch, setTableSearch] = useState('');
  const [tableFilter, setTableFilter] = useState('all');

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardOverview();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDetail = async (txn: Transaction) => {
    try {
      const full = await api.getTransactionDetails(txn.transaction_id);
      setSelectedTxn(full);
      setDrawerOpen(true);
    } catch {
      setSelectedTxn(txn);
      setDrawerOpen(true);
    }
  };

  const getKPIIcon = (id: string) => {
    switch (id) {
      case 'total_txns': return CreditCard;
      case 'fraud_txns': return ShieldAlert;
      case 'fraud_rate': return Percent;
      case 'high_risk_accts': return Users;
      case 'avg_risk': return Gauge;
      case 'total_val': return DollarSign;
      default: return TrendingUp;
    }
  };

  const filteredTransactions = (data?.recent_suspicious_transactions || []).filter((tx: Transaction) => {
    const matchesSearch = 
      tx.transaction_id.toLowerCase().includes(tableSearch.toLowerCase()) ||
      tx.account_id.toLowerCase().includes(tableSearch.toLowerCase()) ||
      tx.location.toLowerCase().includes(tableSearch.toLowerCase()) ||
      tx.detection_reason.toLowerCase().includes(tableSearch.toLowerCase());
    
    if (tableFilter === 'all') return matchesSearch;
    if (tableFilter === 'critical') return matchesSearch && tx.risk_score >= 85;
    if (tableFilter === 'high') return matchesSearch && tx.risk_score >= 70 && tx.risk_score < 85;
    return matchesSearch;
  });

  if (loading && !data) {
    return (
      <div className="space-y-5 animate-pulse font-sans">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 h-80 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl" />
          <div className="h-80 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Telemetry Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Financial Risk Intelligence Platform
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time fraud surveillance, credit risk scoring, and predictive anomaly isolation
          </p>
        </div>
        
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-[#059669] bg-[#ECFDF5] px-3 py-1.5 rounded-lg border border-[#A7F3D0] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
            7.8ms Model Latency
          </span>
          <button
            onClick={fetchData}
            className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] text-[#0F172A] transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Sync Data</span>
          </button>
        </div>
      </div>

      {/* 1. 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {data?.kpis?.map((kpi: any) => (
          <MetricCard
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            changePercentage={kpi.change_percentage}
            trend={kpi.trend}
            comparisonPeriod={kpi.comparison_period}
            status={kpi.status}
            icon={getKPIIcon(kpi.id)}
            sparkline={kpi.sparkline}
          />
        ))}
      </div>

      {/* 2. Main Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1: Transaction Activity Overview */}
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A] tracking-tight">
                Transaction Volume & Threat Trajectory (14-Day Stream)
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Legitimate cleared settlements contrasted with machine-flagged fraud anomalies
              </p>
            </div>
            
            <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-lg border border-[#E2E8F0] text-xs">
              <button
                onClick={() => setActivityTimeframe('daily')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  activityTimeframe === 'daily' ? 'bg-[#FFFFFF] text-[#0F172A] font-semibold shadow-sm border border-[#E2E8F0]' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setActivityTimeframe('weekly')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  activityTimeframe === 'weekly' ? 'bg-[#FFFFFF] text-[#0F172A] font-semibold shadow-sm border border-[#E2E8F0]' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Weekly
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.transaction_activity || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="legitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="suspGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#0F172A', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  itemStyle={{ color: '#0F172A' }}
                />
                <Area
                  type="monotone"
                  dataKey="legitimate"
                  name="Legitimate Cleared"
                  stroke="#059669"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#legitGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="suspicious"
                  name="Flagged Threats"
                  stroke="#DC2626"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#suspGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-[#64748B] pt-4 border-t border-[#F1F5F9] mt-2">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#059669]" /> Legitimate Settlements</span>
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" /> Flagged Outliers</span>
            </div>
            <span className="text-[#94A3B8]">Continuous Live ML Stream</span>
          </div>
        </div>

        {/* Chart 2: Fraud Stratification Donut */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-[#0F172A] tracking-tight">
                Fraud Detection Stratification
              </h3>
              <span className="text-xs text-[#64748B] font-mono">12,000 Records</span>
            </div>

            <div className="h-48 relative flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.fraud_distribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {data?.fraud_distribution?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#0F172A', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#0F172A' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-[#0F172A] font-mono tracking-tight">
                  {data?.kpis?.find((k: any) => k.id === 'fraud_rate')?.value || '10.97%'}
                </span>
                <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">
                  Fraud Ratio
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#F1F5F9] text-xs">
            {data?.fraud_distribution?.map((item: any) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#475569] font-medium">{item.name}</span>
                </div>
                <span className="text-[#0F172A] font-mono font-semibold">
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Second Row: Risk Distribution & Temporal Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Risk Tier Horizontal Bar */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A] tracking-tight">
                Portfolio Risk Stratification (4 Tiers)
              </h3>
              <p className="text-xs text-[#64748B]">Calibrated accounts across severity tiers</p>
            </div>
            <span className="text-xs text-[#64748B] font-mono">5,000 Accounts</span>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data?.risk_distribution || []} margin={{ top: 5, right: 15, left: 15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis dataKey="tier" type="category" stroke="#64748B" fontSize={11} tickLine={false} width={110} />
                <Tooltip
                  formatter={(val: any) => [`${val.toLocaleString()} accounts`, 'Count']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#0F172A', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#0F172A' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {data?.risk_distribution?.map((entry: any, index: number) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temporal Risk Trends */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A] tracking-tight">
                Temporal Risk Score vs. Fraud Progression
              </h3>
              <p className="text-xs text-[#64748B]">Historical risk index progression vs. confirmed incidents</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-[#2563EB]"><span className="w-2 h-2 rounded-full bg-[#2563EB]" /> Risk Score</span>
              <span className="flex items-center gap-1.5 text-[#DC2626]"><span className="w-2 h-2 rounded-full bg-[#DC2626]" /> Incidents</span>
            </div>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.risk_trends || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="period" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#0F172A', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#0F172A' }}
                />
                <Line type="monotone" dataKey="avg_risk_score" stroke="#2563EB" strokeWidth={2} dot={{ r: 2.5 }} />
                <Line type="monotone" dataKey="fraud_incidents" stroke="#DC2626" strokeWidth={2} dot={{ r: 2.5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. AI Risk Intelligence Feed */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A] tracking-tight">
                Autonomous Risk Intelligence & Automated Countermeasures
              </h3>
              <p className="text-xs text-[#64748B]">Machine-generated pattern anomalies and recommended institutional actions</p>
            </div>
          </div>

          {onNavigateToModule && (
            <button
              onClick={() => onNavigateToModule('intelligence')}
              className="text-xs text-[#2563EB] hover:underline flex items-center gap-1 font-semibold"
            >
              Intelligence Bureau <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.ai_insights?.map((ins: any) => (
            <div
              key={ins.id}
              className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                    ins.severity === 'Critical' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]' :
                    ins.severity === 'High' ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]' :
                    ins.severity === 'Medium' ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]' :
                    'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]'
                  }`}>
                    {ins.severity}
                  </span>
                  <span className="text-[11px] text-[#64748B] font-mono">{ins.timestamp}</span>
                </div>
                <h4 className="text-xs font-semibold text-[#0F172A] leading-snug">
                  {ins.title}
                </h4>
                <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                  {ins.description}
                </p>
                <div className="mt-3 text-xs font-mono text-[#0F172A] bg-[#FFFFFF] px-2.5 py-1 rounded-md border border-[#E2E8F0] shadow-2xs">
                  {ins.supporting_metric}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-xs">
                <span className="text-[#64748B] block text-[10px] uppercase font-semibold tracking-wider">Protocol:</span>
                <span className="text-[#0F172A] font-medium leading-tight mt-0.5 block">{ins.recommended_action}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Recent Suspicious Transactions Forensic Table */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-sm font-semibold text-[#0F172A] tracking-tight">
              Recent Suspicious Transactions & Forensic Audit Log
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Machine-flagged events requiring immediate risk officer review
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-56">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter transactions..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-lg border border-[#E2E8F0] text-xs">
              {['all', 'critical', 'high'].map(f => (
                <button
                  key={f}
                  onClick={() => setTableFilter(f)}
                  className={`px-2.5 py-0.5 rounded-md capitalize font-medium transition-all ${
                    tableFilter === f ? 'bg-[#FFFFFF] text-[#0F172A] font-semibold shadow-sm border border-[#E2E8F0]' : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Forensic Data Table */}
        <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[11px] uppercase tracking-wider text-[#475569] bg-[#F8FAFC]">
                <th className="py-3 pl-4 font-semibold">Transaction ID</th>
                <th className="py-3 font-semibold">Account</th>
                <th className="py-3 font-semibold">Amount (USD)</th>
                <th className="py-3 font-semibold">Location</th>
                <th className="py-3 font-semibold">Timestamp</th>
                <th className="py-3 font-semibold">Risk Score</th>
                <th className="py-3 font-semibold">Detection Reason</th>
                <th className="py-3 font-semibold">Status</th>
                <th className="py-3 pr-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] bg-[#FFFFFF]">
              {filteredTransactions.map((tx: Transaction) => (
                <tr
                  key={tx.transaction_id}
                  onClick={() => handleOpenDetail(tx)}
                  className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                >
                  <td className="py-3 pl-4 font-mono font-medium text-[#2563EB] group-hover:underline">
                    {tx.transaction_id}
                  </td>
                  <td className="py-3 font-mono text-[#475569]">{tx.account_id}</td>
                  <td className="py-3 font-mono font-bold text-[#0F172A]">
                    ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 text-[#475569]">{tx.location}</td>
                  <td className="py-3 font-mono text-[#64748B] text-[11px]">{tx.timestamp}</td>
                  <td className="py-3"><RiskBadge level={tx.risk_score} size="xs" /></td>
                  <td className="py-3 text-[#D97706] text-xs max-w-xs truncate font-medium" title={tx.detection_reason}>
                    {tx.detection_reason}
                  </td>
                  <td className="py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-semibold tracking-wide ${
                      tx.status === 'Blocked' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]' :
                      tx.status === 'Under Review' || tx.status === 'Flagged' ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]' :
                      'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenDetail(tx); }}
                      className="p-1.5 rounded-md text-[#64748B] hover:text-[#2563EB] hover:bg-[#F1F5F9] transition-colors"
                      title="Inspect Transaction"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={`Forensic Audit: ${selectedTxn?.transaction_id || ''}`}
        subtitle={`Account ${selectedTxn?.account_id || ''} — Gradient Boosting Attribution`}
        width="max-w-lg"
      >
        {selectedTxn && (
          <div className="space-y-4 font-sans text-xs">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider">Settlement Amount</span>
                <div className="text-2xl font-bold font-mono text-[#0F172A] mt-0.5">
                  ${selectedTxn.amount.toFixed(2)}
                </div>
                <div className="text-xs text-[#64748B] mt-0.5">{selectedTxn.merchant_category}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block mb-1">Threat Assessment</span>
                <RiskBadge level={selectedTxn.risk_score} size="md" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block">Origin Location</span>
                <span className="text-[#0F172A] font-medium block mt-1">{selectedTxn.location}</span>
                <span className="text-[11px] text-[#64748B]">{selectedTxn.distance_miles} miles away</span>
              </div>
              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block">Device & Channel</span>
                <span className="text-[#0F172A] font-medium block mt-1">{selectedTxn.device_type}</span>
                <span className="text-[11px] text-[#64748B]">{selectedTxn.channel}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A]">
              <span className="text-[10px] text-[#92400E] uppercase font-semibold tracking-wider block mb-1">Anomaly Trigger Explanation</span>
              <p className="text-[#B45309] text-xs leading-relaxed font-medium">{selectedTxn.detection_reason}</p>
            </div>

            <div>
              <span className="text-[11px] text-[#475569] uppercase font-semibold tracking-wider block mb-2.5">Timeline Telemetry</span>
              <div className="space-y-2">
                {selectedTxn.timeline?.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                    <div className="flex justify-between items-center text-[#475569]">
                      <span className="text-[#0F172A] font-medium">{step.event}</span>
                      <span className="font-mono text-[11px] text-[#64748B]">{step.timestamp}</span>
                    </div>
                    <p className="text-[#64748B] mt-1">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 flex gap-3">
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex-1 py-2.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
              >
                Block & Freeze Account
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex-1 py-2.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A] font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Dismiss Threat
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
