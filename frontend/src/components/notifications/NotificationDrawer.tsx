import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Drawer } from '../common/Drawer';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, Trash2, CheckCheck } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const { notifications, unreadCount, isOpen, closeDrawer, markAsRead, markAllAsRead, dismissNotification } = useNotifications();

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return <ShieldAlert className="w-5 h-5 text-[#DC2626]" />;
      case 'HIGH':
        return <AlertTriangle className="w-5 h-5 text-[#D97706]" />;
      case 'MEDIUM':
        return <AlertTriangle className="w-5 h-5 text-[#2563EB]" />;
      default:
        return <Info className="w-5 h-5 text-[#059669]" />;
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]';
      case 'HIGH':
        return 'text-[#D97706] bg-[#FFFBEB] border-[#FDE68A]';
      case 'MEDIUM':
        return 'text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE]';
      default:
        return 'text-[#059669] bg-[#ECFDF5] border-[#A7F3D0]';
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeDrawer}
      title="Security & Risk Notifications"
      subtitle={`${unreadCount} unread supervisory alerts`}
      width="max-w-md"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
        <span className="text-xs text-[#64748B]">
          Showing {notifications.length} active alerts
        </span>
        <button
          onClick={markAllAsRead}
          className="text-xs text-[#2563EB] hover:underline flex items-center gap-1 font-medium transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Mark all acknowledged
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-[#94A3B8]">
            <CheckCircle2 className="w-10 h-10 text-[#059669] mx-auto mb-2 opacity-80" />
            <p className="text-sm font-medium text-[#0F172A]">All systems nominal</p>
            <p className="text-xs text-[#64748B]">No unread risk alerts in this session</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                n.read
                  ? 'bg-[#FFFFFF] border-[#E2E8F0] opacity-75'
                  : 'bg-[#F8FAFC] border-[#CBD5E1] shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">{getSeverityIcon(n.severity)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getSeverityBadge(n.severity)}`}>
                      {n.severity}
                    </span>
                    <span className="text-[11px] text-[#94A3B8] font-mono">{n.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-[#0F172A] leading-snug">
                    {n.title}
                  </h4>
                  <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                    {n.description}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissNotification(n.id);
                  }}
                  className="text-[#94A3B8] hover:text-[#DC2626] p-1 rounded transition-colors shrink-0"
                  title="Dismiss alert"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Drawer>
  );
};
