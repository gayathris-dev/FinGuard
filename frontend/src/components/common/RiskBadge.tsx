import React from 'react';

interface RiskBadgeProps {
  level: string | number;
  showDot?: boolean;
  size?: 'xs' | 'sm' | 'md';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, showDot = true, size = 'sm' }) => {
  let text = '';
  let style = '';
  let dotColor = '';

  const strLevel = String(level).toUpperCase();

  if (typeof level === 'number') {
    if (level >= 80) {
      text = `CRITICAL ${level}`;
      style = 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]';
      dotColor = 'bg-[#DC2626]';
    } else if (level >= 55) {
      text = `HIGH ${level}`;
      style = 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]';
      dotColor = 'bg-[#D97706]';
    } else if (level >= 30) {
      text = `MED ${level}`;
      style = 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]';
      dotColor = 'bg-[#2563EB]';
    } else {
      text = `LOW ${level}`;
      style = 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]';
      dotColor = 'bg-[#059669]';
    }
  } else {
    if (strLevel.includes('CRITICAL')) {
      text = 'CRIT';
      style = 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]';
      dotColor = 'bg-[#DC2626]';
    } else if (strLevel.includes('HIGH')) {
      text = 'HIGH';
      style = 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]';
      dotColor = 'bg-[#D97706]';
    } else if (strLevel.includes('MED')) {
      text = 'MED';
      style = 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]';
      dotColor = 'bg-[#2563EB]';
    } else {
      text = 'LOW';
      style = 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]';
      dotColor = 'bg-[#059669]';
    }
  }

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5',
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1'
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono uppercase font-semibold tracking-wider border rounded-full tabular-nums ${style} ${sizeClasses}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      <span>{text}</span>
    </span>
  );
};
