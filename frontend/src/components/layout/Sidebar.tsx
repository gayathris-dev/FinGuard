import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  CreditCard,
  Activity,
  LineChart,
  BrainCircuit,
  Radar,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
}) => {
  const { user, logout } = useAuth();

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'fraud', label: 'Fraud Detection', icon: ShieldAlert, badge: 'ML' },
    { id: 'credit', label: 'Credit Risk Analysis', icon: CreditCard },
    { id: 'monitoring', label: 'Transaction Monitoring', icon: Activity, live: true },
    { id: 'sentiment', label: 'Market Sentiment', icon: LineChart, badge: 'NLP' },
    { id: 'anomaly', label: 'Anomaly Detection', icon: Radar },
    { id: 'intelligence', label: 'Risk Intelligence', icon: BrainCircuit, badge: 'AI' },
    { id: 'reports', label: 'Reports & Audits', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 bg-[#FFFFFF] border-r border-[#E2E8F0] flex flex-col transition-all duration-300 select-none font-sans ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#E2E8F0] shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center shrink-0 shadow-sm">
            <Shield className="w-4 h-4 text-[#FFFFFF]" />
          </div>
          {!collapsed && (
            <div className="flex items-baseline gap-2 truncate">
              <span className="font-bold text-base tracking-tight text-[#0F172A]">
                FinGuard<span className="text-[#2563EB]">AI</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#64748B] px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#E2E8F0]">
                v2.4
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {!collapsed && (
          <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase text-[#94A3B8]">
            Platform Modules
          </div>
        )}

        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative ${
                isActive
                  ? 'bg-[#F1F5F9] text-[#0F172A] font-semibold border border-[#E2E8F0] shadow-sm'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              {/* Left active line indicator */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#2563EB] rounded-r" />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#2563EB]' : 'text-[#64748B] group-hover:text-[#0F172A]'
                }`}
              />

              {!collapsed && (
                <span className="truncate flex-1 text-left text-[13px]">
                  {item.label}
                </span>
              )}

              {!collapsed && item.live && (
                <span className="flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-semibold tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                  LIVE
                </span>
              )}

              {!collapsed && item.badge && !item.live && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Officer Strip */}
      <div className="p-3 border-t border-[#E2E8F0] shrink-0 bg-[#FFFFFF]">
        {!collapsed ? (
          <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                {user?.name ? user.name[0] : 'M'}
              </div>
              <div className="truncate">
                <div className="text-[#0F172A] font-medium truncate">
                  {user?.name || 'Marcus Vance'}
                </div>
                <div className="text-[11px] text-[#64748B] truncate">
                  Principal Risk Officer
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded text-[#64748B] hover:text-[#DC2626] hover:bg-[#F1F5F9] transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="w-full py-2 flex justify-center text-[#64748B] hover:text-[#DC2626] transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
