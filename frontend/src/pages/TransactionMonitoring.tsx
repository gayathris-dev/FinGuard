import React, { useState, useEffect } from 'react';
import {
  Activity,
  Play,
  Pause,
  Search,
  Eye,
  Radio,
  AlertCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';
import { Drawer } from '../components/common/Drawer';
import { api } from '../services/api';
import type { Transaction } from '../types';

export const TransactionMonitoring: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [streamSpeed, setStreamSpeed] = useState<number>(3000);
  const [totalAnalyzedCount, setTotalAnalyzedCount] = useState(12480);
  const [threatsIdentifiedCount, setThreatsIdentifiedCount] = useState(1324);
  const [alertsFiredCount, setAlertsFiredCount] = useState(412);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    api.getTransactions({ page: 1, page_size: 40 }).then((res) => {
      setTransactions(res.items || []);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(async () => {
      try {
        const newBatch = await api.getLiveStreamBatch(1);
        if (newBatch && newBatch.length > 0) {
          const freshItem = newBatch[0];
          setTransactions(prev => [freshItem, ...prev.slice(0, 60)]);
          setTotalAnalyzedCount(c => c + 1);
          if (freshItem.risk_score >= 60) setThreatsIdentifiedCount(c => c + 1);
          if (freshItem.risk_score >= 80) setAlertsFiredCount(c => c + 1);
        }
      } catch (e) {
        console.error('Stream poll error:', e);
      }
    }, streamSpeed);
    return () => clearInterval(interval);
  }, [isStreaming, streamSpeed]);

  const handleOpenDetail = async (tx: Transaction) => {
    try {
      const full = await api.getTransactionDetails(tx.transaction_id);
      setSelectedTxn(full);
      setDrawerOpen(true);
    } catch {
      setSelectedTxn(tx);
      setDrawerOpen(true);
    }
  };

  const filtered = transactions.filter(t => {
    const s = searchTerm.toLowerCase();
    const matchSearch =
      !searchTerm ||
      t.transaction_id.toLowerCase().includes(s) ||
      t.account_id.toLowerCase().includes(s) ||
      t.location.toLowerCase().includes(s);

    let matchRisk = true;
    if (selectedRisk === 'low') matchRisk = t.risk_score < 40;
    else if (selectedRisk === 'medium') matchRisk = t.risk_score >= 40 && t.risk_score < 70;
    else if (selectedRisk === 'high') matchRisk = t.risk_score >= 70 && t.risk_score < 88;
    else if (selectedRisk === 'critical') matchRisk = t.risk_score >= 88;

    let matchStatus = true;
    if (selectedStatus !== 'all') matchStatus = t.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchSearch && matchRisk && matchStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Stream Control Bar */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#0F172A] tracking-tight">
              Real-time Transaction Stream Surveillance
            </h2>
            <p className="text-xs text-[#64748B]">Continuous ingestion with real-time scoring and interception</p>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            {isStreaming ? 'STREAM ONLINE' : 'PAUSED'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              isStreaming
                ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#D97706] hover:bg-[#FEF3C7]'
                : 'bg-[#ECFDF5] border-[#A7F3D0] text-[#059669] hover:bg-[#D1FAE5]'
            }`}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isStreaming ? 'Pause Stream' : 'Resume Stream'}</span>
          </button>

          <div className="flex items-center bg-[#F8FAFC] p-1 rounded-lg border border-[#E2E8F0] text-xs">
            {[1000, 3000, 5000].map(s => (
              <button
                key={s}
                onClick={() => setStreamSpeed(s)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                  streamSpeed === s ? 'bg-[#FFFFFF] text-[#0F172A] font-semibold shadow-sm border border-[#E2E8F0]' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {s / 1000}s
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-sm">
          <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block">Ingested Transactions</span>
          <span className="text-2xl font-bold font-mono text-[#0F172A] mt-1 block tabular-nums">{totalAnalyzedCount.toLocaleString()}</span>
        </div>
        <div className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-sm">
          <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block">ML Scoring Coverage</span>
          <span className="text-2xl font-bold font-mono text-[#059669] mt-1 block tabular-nums">100% (7.8ms)</span>
        </div>
        <div className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-sm">
          <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block">Suspicious Isolated</span>
          <span className="text-2xl font-bold font-mono text-[#D97706] mt-1 block tabular-nums">{threatsIdentifiedCount.toLocaleString()}</span>
        </div>
        <div className="p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-sm">
          <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block">Critical Freezes</span>
          <span className="text-2xl font-bold font-mono text-[#DC2626] mt-1 block tabular-nums">{alertsFiredCount.toLocaleString()}</span>
        </div>
      </div>

      {/* Filter and Live Table */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-[#E2E8F0]">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter live stream by ID, account, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-lg border border-[#E2E8F0] text-xs">
            {['all', 'low', 'medium', 'high', 'critical'].map(r => (
              <button
                key={r}
                onClick={() => setSelectedRisk(r)}
                className={`px-2.5 py-0.5 rounded-md uppercase font-semibold text-[10px] tracking-wider transition-all ${
                  selectedRisk === r ? 'bg-[#FFFFFF] text-[#0F172A] shadow-sm border border-[#E2E8F0]' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[11px] uppercase tracking-wider text-[#475569] bg-[#F8FAFC]">
                <th className="py-3 pl-4 font-semibold">Transaction ID</th>
                <th className="py-3 font-semibold">Account</th>
                <th className="py-3 font-semibold">Amount</th>
                <th className="py-3 font-semibold">MCC</th>
                <th className="py-3 font-semibold">Location</th>
                <th className="py-3 font-semibold">Time</th>
                <th className="py-3 font-semibold">Risk Score</th>
                <th className="py-3 font-semibold">Status</th>
                <th className="py-3 pr-4 text-right font-semibold">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] bg-[#FFFFFF]">
              {filtered.slice(0, 35).map((tx) => (
                <tr
                  key={tx.transaction_id}
                  onClick={() => handleOpenDetail(tx)}
                  className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                >
                  <td className="py-3 pl-4 font-mono font-medium text-[#2563EB] group-hover:underline">{tx.transaction_id}</td>
                  <td className="py-3 font-mono text-[#475569]">{tx.account_id}</td>
                  <td className="py-3 font-mono font-bold text-[#0F172A] tabular-nums">
                    ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 text-[#475569]">{tx.merchant_category}</td>
                  <td className="py-3 text-[#475569]">{tx.location}</td>
                  <td className="py-3 font-mono text-[#64748B] text-[11px]">{tx.timestamp}</td>
                  <td className="py-3"><RiskBadge level={tx.risk_score} size="xs" /></td>
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
                    <button onClick={(e) => { e.stopPropagation(); handleOpenDetail(tx); }} className="p-1.5 rounded text-[#64748B] hover:text-[#2563EB] hover:bg-[#F1F5F9]">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={`Stream Audit: ${selectedTxn?.transaction_id || ''}`}
        subtitle={`Account ${selectedTxn?.account_id || ''}`}
      >
        {selectedTxn && (
          <div className="space-y-4 font-sans text-xs">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex justify-between items-center">
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider">Settlement Amount</span>
                <div className="text-2xl font-bold font-mono text-[#0F172A] mt-0.5">${selectedTxn.amount.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider block mb-1">Threat Score</span>
                <RiskBadge level={selectedTxn.risk_score} size="md" />
              </div>
            </div>
            <div className="p-3.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A]">
              <span className="text-[10px] text-[#92400E] uppercase font-semibold tracking-wider block">Trigger Rationale</span>
              <p className="text-[#B45309] text-xs mt-1 font-medium leading-relaxed">{selectedTxn.detection_reason}</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
