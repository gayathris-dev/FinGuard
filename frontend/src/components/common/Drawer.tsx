import React, { useEffect } from 'react';
import { X, Shield } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'max-w-md'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6">
        <div className={`w-screen ${width} bg-[#FFFFFF] border-l border-[#E2E8F0] shadow-2xl flex flex-col`}>
          {/* Header */}
          <div className="p-4 border-b border-[#E2E8F0] flex items-start justify-between bg-[#F8FAFC]">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                <Shield className="w-4 h-4 text-[#2563EB]" />
                <span>{title}</span>
              </div>
              {subtitle && (
                <p className="text-xs text-[#64748B] mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
              title="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FFFFFF]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
