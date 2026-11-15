import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  changePercentage: number;
  trend: 'up' | 'down' | 'neutral';
  comparisonPeriod: string;
  status: 'positive' | 'warning' | 'critical' | 'neutral';
  icon: LucideIcon;
  sparkline?: number[];
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  changePercentage,
  trend,
  comparisonPeriod,
  status,
  icon: Icon,
  sparkline = []
}) => {
  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;
    const width = 72;
    const height = 24;

    const points = sparkline.map((val, idx) => {
      const x = (idx / (sparkline.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    }).join(' ');

    const strokeColor = status === 'positive' 
      ? '#059669' 
      : status === 'critical' 
        ? '#DC2626' 
        : status === 'warning' 
          ? '#D97706' 
          : '#2563EB';

    return (
      <svg className="w-18 h-6 overflow-visible shrink-0 ml-2" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  const getDeltaStyle = () => {
    if (status === 'positive') return 'text-[#059669] bg-[#ECFDF5] border-[#A7F3D0]';
    if (status === 'critical') return 'text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]';
    if (status === 'warning') return 'text-[#D97706] bg-[#FFFBEB] border-[#FDE68A]';
    return 'text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE]';
  };

  const statusAccent = {
    positive: '#059669',
    critical: '#DC2626',
    warning: '#D97706',
    neutral: '#2563EB'
  }[status];

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl p-4 transition-all duration-200 relative overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-md font-sans">
      {/* 2px top status accent line */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px] opacity-90"
        style={{ backgroundColor: statusAccent }}
      />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider text-[#64748B] uppercase">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0 text-[#64748B] group-hover:text-[#0F172A] transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between mb-3">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-[#0F172A] tabular-nums">
          {value}
        </span>
        {renderSparkline()}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] text-xs">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold tracking-wide ${getDeltaStyle()}`}>
          {trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
          {trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
          {trend === 'neutral' && <Minus className="w-3 h-3" />}
          <span>{changePercentage > 0 ? `+${changePercentage}` : changePercentage}%</span>
        </span>
        <span className="text-[#94A3B8] text-[11px] truncate ml-2">
          {comparisonPeriod}
        </span>
      </div>
    </div>
  );
};
