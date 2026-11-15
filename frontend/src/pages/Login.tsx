import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldAlert, CheckCircle2, Zap, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/common/Modal';

interface LoginProps {
  onSuccess?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('m.vance@finguard.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    await login(email, password, rememberMe);
    setIsLoading(false);
    if (onSuccess) onSuccess();
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginAsDemo();
      setIsLoading(false);
      if (onSuccess) onSuccess();
    }, 400);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverySent(true);
    setTimeout(() => {
      setRecoverySent(false);
      setForgotModalOpen(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0F172A] text-white shadow-md mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            FinGuard <span className="text-[#2563EB]">AI</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-1 font-medium">
            Intelligent Financial Risk Detection & Surveillance Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-8 shadow-xl transition-all">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[#0F172A]">
              Institutional Sign-In
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Access real-time fraud inference & predictive credit models
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-[#475569] mb-1.5">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@institution.com"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#475569]">
                  Security Passkey
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[11px] text-[#2563EB] hover:underline transition-colors"
                >
                  Forgot key?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#F8FAFC] border-[#E2E8F0] text-[#2563EB] focus:ring-0 cursor-pointer"
                />
                <span className="text-xs text-[#64748B]">
                  Remember device session (24h token)
                </span>
              </label>
            </div>

            {/* Standard Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Verifying Credentials...' : 'Authenticate Session'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-[#FFFFFF] px-2 text-[#94A3B8]">
                Fast-Track Evaluation
              </span>
            </div>
          </div>

          {/* Demo Login Button */}
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] text-[#2563EB] font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            Demo Account Instant Login (Chief Risk Officer)
          </button>

          {/* Demo Sandbox Notice */}
          <div className="mt-6 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#64748B] flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#0F172A]">Environment:</strong> Local ML inference active. Pre-trained Gradient Boosting, Isolation Forest, and NLP TF-IDF models ready.
            </span>
          </div>
        </div>

        {/* Security badges */}
        <div className="flex items-center justify-center gap-4 mt-6 text-[11px] text-[#94A3B8] font-mono">
          <span>SOC2 Type II</span>
          <span>•</span>
          <span>ISO 27001 Certified</span>
          <span>•</span>
          <span>FIPS 140-3 Encryption</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Passkey Reset Request"
        subtitle="Submit your institutional email to dispatch a cryptographic security link."
      >
        {recoverySent ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-[#059669] mx-auto" />
            <h4 className="text-sm font-semibold text-[#0F172A]">Reset Instructions Dispatched</h4>
            <p className="text-xs text-[#64748B]">
              A temporary authorization token has been routed to your registered identity provider.
            </p>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#475569] mb-1.5">
                Work Email Address
              </label>
              <input
                type="email"
                required
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="analyst@institution.com"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] font-mono"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0F172A] text-white font-semibold text-xs hover:bg-[#1E293B] transition-colors shadow-sm"
              >
                Dispatch Security Token
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
