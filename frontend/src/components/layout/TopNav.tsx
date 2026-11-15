import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Shield,
  Activity,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

interface TopNavProps {
  currentTab: string;
  onSearch?: (term: string) => void;
  dateRange: string;
  onChangeDateRange: (range: string) => void;
  sidebarCollapsed: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onSearch,
  dateRange,
  onChangeDateRange,
  sidebarCollapsed
}) => {
  const { unreadCount, toggleDrawer } = useNotifications();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [timeUtc, setTimeUtc] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeUtc(now.toISOString().slice(11, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'overview': return 'Executive Overview';
      case 'fraud': return 'Fraud Detection Engine';
      case 'credit': return 'Credit Risk Analysis';
      case 'monitoring': return 'Transaction Monitoring';
      case 'sentiment': return 'Market Sentiment Intelligence';
      case 'anomaly': return 'Anomaly Detection Engine';
      case 'intelligence': return 'Consolidated Risk Intelligence';
      case 'reports': return 'Reports & Regulatory Audits';
      case 'settings': return 'System Settings & Security';
      default: return 'Risk Console';
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-14 bg-[#FFFFFF] border-b border-[#E2E8F0] flex items-center justify-between px-6 transition-all duration-300 shadow-sm ${
        sidebarCollapsed ? 'left-16' : 'left-64'
      }`}
    >
      {/* Left: Dynamic Breadcrumb */}
      <div className="flex items-center gap-3 shrink-0 pr-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#94A3B8] font-medium hidden sm:inline">FinGuard /</span>
          <h1 className="text-sm font-semibold tracking-tight text-[#0F172A] whitespace-nowrap">
            {getTabTitle(currentTab)}
          </h1>
        </div>
      </div>

      {/* Center: System Telemetry */}
      <div className="hidden 2xl:flex items-center gap-5 text-xs text-[#64748B] border-x border-[#E2E8F0] px-5 py-1 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#059669]" />
          <span className="text-[#0F172A] font-medium">Models Operational</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#94A3B8]">Latency:</span>
          <span className="text-[#059669] font-mono font-medium">3.4ms</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#94A3B8]">Throughput:</span>
          <span className="text-[#2563EB] font-mono font-medium">142 txn/s</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#94A3B8]">Time:</span>
          <span className="text-[#0F172A] font-mono">{timeUtc}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-52 lg:w-64">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search account, txn, MCC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-lg pl-9 pr-8 py-1.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none transition-colors"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#64748B] bg-[#F1F5F9] px-1.5 py-0.5 rounded border border-[#E2E8F0]">
            ⌘K
          </kbd>
        </form>

        {/* Date Range Selector */}
        <div className="hidden sm:flex items-center p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-medium">
          {['24h', '7d', '30d'].map((r) => (
            <button
              key={r}
              onClick={() => onChangeDateRange(r)}
              className={`px-2.5 py-1 rounded-md transition-all uppercase text-[11px] ${
                dateRange === r
                  ? 'bg-[#FFFFFF] text-[#0F172A] font-semibold shadow-sm border border-[#E2E8F0]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Notifications Bell */}
        <button
          onClick={toggleDrawer}
          className="relative p-2 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors shadow-sm"
          title="Security Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Pill */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-[#E2E8F0]">
          <div className="flex items-center gap-2 py-1 px-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="w-2 h-2 rounded-full bg-[#059669]" />
            <span className="text-xs font-medium text-[#0F172A]">{user?.name || 'Marcus Vance'}</span>
            <span className="text-[10px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.5 rounded border border-[#BFDBFE]">
              TIER-4
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
