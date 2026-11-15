import React, { useState, useEffect } from 'react';
import {
  Shield,
  Sliders,
  Bell,
  Cpu,
  RefreshCw,
  Save,
  Server,
  CheckCircle2,
  Lock,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [thresholds, setThresholds] = useState({
    fraud_score_critical: 80,
    fraud_score_high: 55,
    fraud_score_medium: 30,
    credit_dti_ceiling: 0.45,
    credit_score_floor: 620,
    velocity_alert_limit_24h: 5
  });

  const [notifications, setNotifications] = useState({
    email_alerts: true,
    slack_webhook_active: true,
    sms_critical_escalation: true,
    daily_risk_digest: true
  });

  useEffect(() => {
    api.getSettings().then(res => {
      if (res.risk_thresholds) setThresholds(res.risk_thresholds);
      if (res.notifications) setNotifications(res.notifications);
    }).catch(console.error);
  }, []);

  const handleSaveThresholds = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateThresholds(thresholds);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to update thresholds:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
            System Settings & Security Policy
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Configure risk thresholds, automated freeze actions, and officer clearance boundaries
          </p>
        </div>

        {saveSuccess && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-[#059669] bg-[#ECFDF5] px-3 py-1.5 rounded-lg border border-[#A7F3D0]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Policy Deployed Across All Inference Nodes</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Sliders */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wider">
              Automated Policy Enforcement Thresholds
            </h3>

            <form onSubmit={handleSaveThresholds} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-[#64748B]">Critical Freeze Threshold:</span>
                    <span className="text-[#DC2626] font-mono font-bold">{thresholds.fraud_score_critical} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="95"
                    value={thresholds.fraud_score_critical}
                    onChange={(e) => setThresholds({ ...thresholds, fraud_score_critical: parseInt(e.target.value) })}
                    className="w-full h-2 bg-[#F1F5F9] rounded-lg appearance-none cursor-pointer accent-[#DC2626]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-[#64748B]">High Risk Threshold:</span>
                    <span className="text-[#D97706] font-mono font-bold">{thresholds.fraud_score_high} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="75"
                    value={thresholds.fraud_score_high}
                    onChange={(e) => setThresholds({ ...thresholds, fraud_score_high: parseInt(e.target.value) })}
                    className="w-full h-2 bg-[#F1F5F9] rounded-lg appearance-none cursor-pointer accent-[#D97706]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#F1F5F9]">
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">DTI Ceiling</label>
                  <input
                    type="number"
                    step="0.01"
                    value={thresholds.credit_dti_ceiling}
                    onChange={(e) => setThresholds({ ...thresholds, credit_dti_ceiling: parseFloat(e.target.value) || 0.45 })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] font-mono text-xs focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">24h Velocity Cap</label>
                  <input
                    type="number"
                    min="2"
                    max="20"
                    value={thresholds.velocity_alert_limit_24h}
                    onChange={(e) => setThresholds({ ...thresholds, velocity_alert_limit_24h: parseInt(e.target.value) || 5 })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg px-3 py-2 text-[#0F172A] font-mono text-xs focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
                >
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Deploy Policy</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: User & Infrastructure */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl space-y-3 shadow-sm">
            <span className="font-semibold text-[#0F172A] uppercase text-xs tracking-wider block">Authenticated Officer</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center"><span className="text-[#64748B]">Officer:</span><span className="text-[#0F172A] font-medium">{user?.name}</span></div>
              <div className="flex justify-between items-center"><span className="text-[#64748B]">Clearance:</span><span className="text-[#2563EB] font-mono font-bold bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">{user?.securityLevel}</span></div>
              <div className="flex justify-between items-center"><span className="text-[#64748B]">Audit ID:</span><span className="text-[#64748B] font-mono">{user?.id}</span></div>
            </div>
          </div>

          <div className="p-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl space-y-3 shadow-sm">
            <span className="font-semibold text-[#0F172A] uppercase text-xs tracking-wider block">Infrastructure Health</span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <span className="text-[#64748B] uppercase font-semibold text-[10px] block">FastAPI Core</span>
                <span className="text-[#059669] font-mono font-bold block mt-1">ONLINE (99.98%)</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <span className="text-[#64748B] uppercase font-semibold text-[10px] block">Scikit-Learn ML</span>
                <span className="text-[#2563EB] font-mono font-bold block mt-1">7.8 MS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
