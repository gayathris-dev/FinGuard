import React from 'react';

interface StatusIndicatorProps {
  status: 'online' | 'warning' | 'critical' | 'offline';
  label?: string;
  sublabel?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label, sublabel }) => {
  const statusConfig = {
    online: {
      dot: 'bg-accent-primary',
      ring: 'bg-accent-primary/20',
      text: 'text-fg-primary',
      defaultLabel: 'Live System Operational'
    },
    warning: {
      dot: 'bg-risk-medium',
      ring: 'bg-risk-medium/20',
      text: 'text-risk-medium',
      defaultLabel: 'Elevated Latency'
    },
    critical: {
      dot: 'bg-risk-critical',
      ring: 'bg-risk-critical/20',
      text: 'text-risk-critical',
      defaultLabel: 'Critical Disruption'
    },
    offline: {
      dot: 'bg-gray-500',
      ring: 'bg-gray-500/20',
      text: 'text-gray-400',
      defaultLabel: 'System Standby'
    }
  }[status];

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center">
        <span className={`absolute w-3 h-3 rounded-full ${statusConfig.ring} animate-radar`} />
        <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
      </div>
      {(label || statusConfig.defaultLabel) && (
        <div className="flex flex-col">
          <span className={`text-xs font-medium ${statusConfig.text}`}>
            {label || statusConfig.defaultLabel}
          </span>
          {sublabel && (
            <span className="text-[10px] text-fg-muted font-mono leading-none">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
